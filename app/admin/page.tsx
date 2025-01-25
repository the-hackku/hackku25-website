"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, CheckSquare, Calendar, QrCode } from "lucide-react";

export default async function AdminPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Users Link */}
        <Link href="/admin/users">
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader className="flex items-center space-x-4">
              <User size={32} className="text-blue-600" />
              <CardTitle className="text-xl">Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View, edit, or remove user details, and manage user roles.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Admin Check-ins Link */}
        <Link href="/admin/checkins">
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader className="flex items-center space-x-4">
              <CheckSquare size={32} className="text-green-600" />
              <CardTitle className="text-xl">Manage Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and manage event check-ins for all participants.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Admin Events Link */}
        <Link href="/admin/events">
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader className="flex items-center space-x-4">
              <Calendar size={32} className="text-purple-600" />
              <CardTitle className="text-xl">Manage Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create, edit, or delete events and update event schedules.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Scanner Link */}
        <Link href="/admin/scanner">
          <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardHeader className="flex items-center space-x-4">
              <QrCode size={32} className="text-red-600" />
              <CardTitle className="text-xl">QR Code Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the scanner to validate participant check-ins using QR
                codes.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
