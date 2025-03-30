// Helper function: Check if two timestamps are within 10 minutes
export const isWithinDynamicMinutes = (date1: Date, date2: Date, skip:number) => {
    return Math.abs(date1.getTime() - date2.getTime()) <= (skip || 10) * 60 * 1000; // 10 minutes
  };
  