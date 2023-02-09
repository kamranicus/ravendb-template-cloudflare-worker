export declare type DateContext = "From" | "To";
export interface DateWithContext {
    date: Date;
    context: DateContext;
}
export declare class DatesComparator {
    static compare(lhs: DateWithContext, rhs: DateWithContext): number;
}
export declare function leftDate(date: Date): DateWithContext;
export declare function rightDate(date: Date): DateWithContext;
export declare function definedDate(date: Date): DateWithContext;
