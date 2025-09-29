import { NextRequest, NextResponse } from 'next/server'
import { SubmissionsDAL } from '@/lib/submissions-dal'
import { withAuth } from '@/lib/auth-middleware'

export const PATCH = withAuth(async (request: AuthenticatedRequest, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const { status } = await request.json()

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be pending, approved, or rejected' }, { status: 400 })
    }

    // Update the submission status
    const updatedSubmission = await SubmissionsDAL.updateStatus(id, status, request.user.id)

    if (!updatedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    console.log(`✅ Submission ${id} status updated to ${status} by user ${request.user.id}`)

    return NextResponse.json({ 
      success: true, 
      submission: updatedSubmission,
      message: `Status updated to ${status}`
    })

  } catch (error) {
    console.error('❌ Error updating submission status:', error)
    return NextResponse.json({ 
      error: 'Failed to update submission status',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}, 'volunteer') // Only authenticated volunteers and above can update status
