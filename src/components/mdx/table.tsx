import { cn } from "@/lib/utils";

/** Responsive, styled MDX table components */

export function Table({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-border shadow-sm">
      <table
        className={cn("w-full text-sm border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function THead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-muted/60 border-b border-border", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        "divide-y divide-border [&_tr:last-child]:border-0",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TR({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-muted/40 even:bg-muted/20",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TH({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left font-semibold text-foreground tracking-tight whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TD({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-muted-foreground align-top leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
