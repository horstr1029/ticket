import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your account and workspace" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace</CardTitle>
              <CardDescription className="text-xs">General workspace settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Workspace name</Label>
                <Input defaultValue="My Company Support" className="h-8 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Support email</Label>
                <Input defaultValue="support@mycompany.com" className="h-8 text-sm" />
              </div>
              <Button size="sm">Save changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription className="text-xs">Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">First name</Label>
                  <Input defaultValue="John" className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Last name</Label>
                  <Input defaultValue="Doe" className="h-8 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input defaultValue="john@mycompany.com" className="h-8 text-sm" />
              </div>
              <Button size="sm">Update profile</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
