"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const enrollmentData = [
  { month: "Jan", registrations: 65, approved: 58 },
  { month: "Feb", registrations: 89, approved: 82 },
  { month: "Mar", registrations: 124, approved: 118 },
  { month: "Apr", registrations: 156, approved: 145 },
  { month: "May", registrations: 198, approved: 189 },
  { month: "Jun", registrations: 234, approved: 225 },
]

export function EnrollmentChart() {
  const maxValue = Math.max(...enrollmentData.map(d => Math.max(d.registrations, d.approved)))
  
  return (
    <Card className="hover:border-primary/20 transition-all duration-300 hover:shadow-medium bg-gradient-to-br from-card via-card to-card/95 border-border/60">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg font-bold">Enrollment Trends</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">Monthly registration and approval statistics</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Chart Container */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-48 sm:h-56 flex flex-col justify-between text-xs text-muted-foreground -ml-8 sm:-ml-10">
            {[0, 25, 50, 75, 100].map((value) => (
              <div key={value} className="h-0 flex items-center">
                <span className="text-[10px] sm:text-xs">{Math.round((maxValue * value) / 100)}</span>
              </div>
            ))}
          </div>
          
          {/* Chart Area */}
          <div className="ml-6 sm:ml-8 h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-2">
            {enrollmentData.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center group">
                {/* Bars Container */}
                <div className="relative w-full h-full flex items-end justify-center gap-0.5 sm:gap-1">
                  {/* Registrations Bar */}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-3 sm:w-4 bg-gradient-to-t from-chart-1 to-chart-1/80 rounded-t-sm transition-all duration-300 hover:from-chart-1/90 hover:to-chart-1/70 group-hover:shadow-lg"
                      style={{ 
                        height: `${(item.registrations / maxValue) * 100}%`,
                        minHeight: item.registrations > 0 ? '4px' : '0px'
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {item.registrations} registrations
                      </div>
                    </div>
                  </div>
                  
                  {/* Approved Bar */}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className="w-3 sm:w-4 bg-gradient-to-t from-chart-2 to-chart-2/80 rounded-t-sm transition-all duration-300 hover:from-chart-2/90 hover:to-chart-2/70 group-hover:shadow-lg"
                      style={{ 
                        height: `${(item.approved / maxValue) * 100}%`,
                        minHeight: item.approved > 0 ? '4px' : '0px'
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        {item.approved} approved
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* X-axis label */}
                <div className="mt-2 text-[10px] sm:text-xs text-muted-foreground font-medium">
                  {item.month}
                </div>
              </div>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 ml-6 sm:ml-8 h-48 sm:h-56">
            {[0, 25, 50, 75, 100].map((value, index) => (
              <div 
                key={index}
                className="absolute w-full border-t border-muted/30"
                style={{ top: `${value}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-gradient-to-r from-chart-1 to-chart-1/80 rounded-sm shadow-soft"></div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">Registrations</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 bg-gradient-to-r from-chart-2 to-chart-2/80 rounded-sm shadow-soft"></div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">Approved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}