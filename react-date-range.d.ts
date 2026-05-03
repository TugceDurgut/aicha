// react-date-range.d.ts
declare module "react-date-range" {
  import * as React from "react";

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface RangeKeyDict {
    selection: Range;
    [key: string]: Range;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange?: (ranges: RangeKeyDict) => void;
    moveRangeOnFirstSelection?: boolean;
    editableDateInputs?: boolean;
    minDate?: Date;
    rangeColors?: string[];
  }

  export class DateRange extends React.Component<DateRangeProps> {}
  export { DateRange };
}
