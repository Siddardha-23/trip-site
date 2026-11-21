import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExpenseSplitter } from "@/components/expenses/ExpenseSplitter";
import { BudgetTracker } from "@/components/budget/BudgetTracker";
import { DriverRotationPanel } from "@/components/drivers/DriverRotationPanel";
import { budgetItems, people } from "@/lib/seed/trip-seed";

export default function MoneyPage() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <SectionHeader
          title="Expense split"
          subtitle="Log who paid for what. Balances and settle-up update automatically."
        />
        <ExpenseSplitter seedExpenses={[]} seedPeople={people} />
      </section>

      <section>
        <SectionHeader
          title="Budget"
          subtitle="The document's priced and not-yet-priced costs. No whole-trip total yet."
        />
        <BudgetTracker seed={budgetItems} />
      </section>

      <section>
        <SectionHeader
          title="Driver rotation"
          subtitle="Who can drive, and the warning for the long December 28 leg."
        />
        <DriverRotationPanel seedPeople={people} />
      </section>
    </div>
  );
}
