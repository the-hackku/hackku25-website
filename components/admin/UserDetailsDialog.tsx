"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/app/actions/admin";
import { IconLoader } from "@tabler/icons-react";

interface UserDetailsDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

interface ParticipantInfo {
  firstName: string;
  lastName: string;
}

interface Checkin {
  id: string;
  event: { name: string };
  createdAt: string; // We will store `createdAt` as string when it is passed to the front-end
}

interface TravelReimbursement {
  id: string;
  transportationMethod: string;
  address: string;
  distance: number;
  estimatedCost: number;
  reason: string;
  createdAt: string;
}

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  currentSchool?: string;
  major?: string;
  dietaryRestrictions?: string;
}

interface User {
  name: string | null;
  email: string;
  role: string;
  checkinsAsUser: Checkin[];
  ParticipantInfo?: ParticipantInfo | null;
  TravelReimbursement?: TravelReimbursement[]; // Add this
}

export function UserDetailsDialog({
  userId,
  onOpenChange,
}: UserDetailsDialogProps) {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const user = await getUserById(userId);
          //   TODO FIX THIS
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setUserDetails(user);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          setUserDetails(null);
        }
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="text-center">
            <IconLoader size={24} className="animate-spin mx-auto" />
          </div>
        ) : userDetails ? (
          <>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Basic Information{" "}
                    {userDetails.ParticipantInfo ? (
                      ""
                    ) : (
                      <span className="text-sm text-red-400">
                        - NOT REGISTERED
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Name:</p>
                    <p>
                      {userDetails.ParticipantInfo
                        ? `${userDetails.ParticipantInfo.firstName} ${userDetails.ParticipantInfo.lastName}`
                        : userDetails.name || "No Name Found"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Role:</p>
                    <Badge variant="outline">{userDetails.role}</Badge>
                  </div>
                  <div>
                    <p className="font-medium">Total Check-ins:</p>
                    <p>{userDetails.checkinsAsUser.length}</p>
                  </div>
                </CardContent>
              </Card>

              {userDetails.ParticipantInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle>Participant Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Phone Number:</p>
                      <p>{userDetails.ParticipantInfo.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Current School:</p>
                      <p>
                        {userDetails.ParticipantInfo.currentSchool || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Major:</p>
                      <p>{userDetails.ParticipantInfo.major || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Dietary Restrictions:</p>
                      <p>
                        {userDetails.ParticipantInfo.dietaryRestrictions ||
                          "None"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {userDetails.TravelReimbursement &&
                userDetails.TravelReimbursement.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Reimbursement Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {userDetails.TravelReimbursement.map((reimbursement) => (
                        <div key={reimbursement.id}>
                          <p>
                            <strong>Transport:</strong>{" "}
                            {reimbursement.transportationMethod}
                          </p>
                          <p>
                            <strong>Address:</strong> {reimbursement.address}
                          </p>
                          <p>
                            <strong>Distance:</strong> {reimbursement.distance}{" "}
                            miles
                          </p>
                          <p>
                            <strong>Estimated Cost:</strong> $
                            {reimbursement.estimatedCost.toFixed(2)}
                          </p>
                          <p>
                            <strong>Reason:</strong> {reimbursement.reason}
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted on:{" "}
                            {new Date(
                              reimbursement.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

              <Card>
                <CardHeader>
                  <CardTitle>Check-in History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userDetails.checkinsAsUser.length > 0 ? (
                      userDetails.checkinsAsUser.map((checkin) => (
                        <div key={checkin.id} className="border p-4 rounded">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {checkin.event.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(checkin.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No check-in history</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="text-center">User not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
