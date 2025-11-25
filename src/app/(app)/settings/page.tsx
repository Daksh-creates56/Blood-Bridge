'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 md:p-0">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your application preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-lg">Theme</Label>
              <div className="flex items-center gap-2 rounded-md border p-1">
                 <Button
                    variant={theme === 'light' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="sr-only">Light mode</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="sr-only">Dark mode</span>
                  </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardDescription>This application was made possible by the following creators.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <p className="font-semibold text-lg">Daksh Ranjan Srivastava</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <p className="font-semibold text-lg">Nimish Bordiya</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
