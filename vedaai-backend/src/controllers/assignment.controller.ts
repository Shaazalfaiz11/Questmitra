import { Request, Response } from "express"
import { Assignment }        from "../models/assignment.model"
import { getGenerationQueue } from "../queues/generation.queue"

const VALID_TYPES = ["mcq", "short", "long"]

const validateBody = (body: any): string | null => {
  if (!body.subject?.trim())         return "subject is required"
  if (!body.topic?.trim())           return "topic is required"
  if (!body.totalMarks)              return "totalMarks is required"
  if (Number(body.totalMarks) <= 0)  return "totalMarks must be greater than 0"
  if (Number(body.totalMarks) > 500) return "totalMarks cannot exceed 500"
  if (!Number.isInteger(Number(body.totalMarks))) return "totalMarks must be a whole number"
  if (!Array.isArray(body.questionTypes) || body.questionTypes.length === 0)
    return "questionTypes must be a non-empty array"
  const invalid = body.questionTypes.filter((t: string) => !VALID_TYPES.includes(t))
  if (invalid.length) return `invalid questionTypes: ${invalid.join(", ")}`
  return null
}

export const createAssignment = async (req: Request, res: Response) => {
  const err = validateBody(req.body)
  if (err) return res.status(400).json({ message: err })

  let assignment: InstanceType<typeof Assignment> | null = null

  try {
    assignment = await Assignment.create({
      subject:       req.body.subject.trim(),
      topic:         req.body.topic.trim(),
      totalMarks:    Number(req.body.totalMarks),
      questionTypes: req.body.questionTypes,
      instructions:  req.body.instructions?.trim() || "Attempt all questions",
      dueDate:       req.body.dueDate || null,
      status:        "generating",
    })

    const job = await getGenerationQueue().add(
      "generate-paper",
      { assignmentId: assignment._id }
    )

    res.status(201).json({
      message: "Assignment created. Generation started.",
      jobId:   job.id,
      data:    assignment,
    })
  } catch (error) {
    console.error("createAssignment error:", error)

    // The record is created before the job is queued, so a failed enqueue would
    // otherwise leave it stuck on "generating" forever.
    if (assignment) {
      await Assignment.findByIdAndUpdate(assignment._id, {
        status: "failed",
        error: error instanceof Error ? error.message : "Could not queue generation",
      }).catch(() => {})
    }

    res.status(500).json({ message: "Internal server error" })
  }
}

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ message: "Assignment not found" })
    res.json(assignment)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const listAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .select("-result")
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(assignments)
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id)
    if (!assignment) return res.status(404).json({ message: "Assignment not found" })
    res.json({ message: "Deleted successfully" })
  } catch {
    res.status(500).json({ message: "Internal server error" })
  }
}