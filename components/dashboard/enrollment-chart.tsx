"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const enrollmentData = [
  { month: "Jan", registrations: 65, approved: 58 },
  { month: "Feb", registrations: 89, approved: 82 },
  { month: "Mar", registrations: 124, approved: 118 },
  { month: "Apr", registrations: 156, approved: 145 },
  { month: "May", registrations: 198, approved: 189 },
  { month: "Jun", registrations: 234, approved: 225 },
]

export function EnrollmentChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Enrollment Trends</CardTitle>
        <CardDescription>Monthly registration and approval statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-muted-foreground" fontSize={12} />
            <YAxis className="text-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="registrations" fill="hsl(var(--chart-1))" name="Registrations" radius={[2, 2, 0, 0]} />
            <Bar dataKey="approved" fill="hsl(var(--chart-2))" name="Approved" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
