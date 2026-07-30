import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageSettingsCard,
  PaymentCard,
} from "@/features/dashboard/components/settings-form";
import { getDashboardData } from "@/features/dashboard/queries";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const data = await getDashboardData();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PaymentCard profile={data.profile} />
      {data.settings ? <PageSettingsCard settings={data.settings} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in as {data.profile.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            🔒 We only ever store your public UPI ID. We will never ask for
            your UPI PIN, OTP, bank password, or card details — anyone who
            does is trying to scam you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
