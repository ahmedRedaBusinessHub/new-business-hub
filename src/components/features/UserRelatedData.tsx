"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

interface UserRelatedDataProps {
  userId: number;
}

export function UserRelatedData({ userId }: UserRelatedDataProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    userPrograms: [] as any[],
    contacts: [] as any[],
    resetPasswordTokens: [] as any[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsRes, contactsRes, resetTokensRes] = await Promise.all([
          fetch(`/api/user-program/user/${userId}`).catch(() => null),
          fetch(`/api/contacts/user/${userId}`).catch(() => null),
          fetch(`/api/reset-password-tokens/user/${userId}`).catch(() => null),
        ]);

        const programsData = programsRes?.ok ? await programsRes.json() : { data: [] };
        const contactsData = contactsRes?.ok ? await contactsRes.json() : { data: [] };
        const resetTokensData = resetTokensRes?.ok ? await resetTokensRes.json() : { data: [] };

        setData({
          userPrograms: Array.isArray(programsData.data) ? programsData.data : [],
          contacts: Array.isArray(contactsData.data) ? contactsData.data : [],
          resetPasswordTokens: Array.isArray(resetTokensData.data) ? resetTokensData.data : [],
        });
      } catch (error) {
        console.error("Error fetching user related data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-4 text-center">Loading related data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Programs ({data.userPrograms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {data.userPrograms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No programs enrolled</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.userPrograms.map((program: any) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      {program.programs?.name || program.program_name || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={program.status === 1 ? "default" : "secondary"}>
                        {program.status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {program.created_at
                        ? new Date(program.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({data.contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {data.contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No contacts</p>
          ) : (
            <div className="space-y-4">
              {data.contacts.map((contact: any) => (
                <ContactWithInteractions key={contact.id} contact={contact} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Password Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Reset Password Tokens ({data.resetPasswordTokens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {data.resetPasswordTokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reset password tokens</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.resetPasswordTokens.map((token: any) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-mono text-xs">
                      {token.token?.substring(0, 20) + "..." || "-"}
                    </TableCell>
                    <TableCell>
                      {token.expires_at
                        ? new Date(token.expires_at).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={token.used ? "default" : "secondary"}>
                        {token.used ? "Used" : "Unused"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {token.created_at
                        ? new Date(token.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component to display contact with its interactions
function ContactWithInteractions({ contact }: { contact: any }) {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contact-interaction?contact_id=${contact.id}`);
        if (response.ok) {
          const data = await response.json();
          setInteractions(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error("Error fetching contact interactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (contact.id) {
      fetchInteractions();
    }
  }, [contact.id]);

  return (
    <Accordion type="single" collapsible className="border rounded-lg">
      <AccordionItem value={`contact-${contact.id}`}>
        <AccordionTrigger className="px-4">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">{contact.name || "-"}</p>
                <p className="text-sm text-muted-foreground">
                  {contact.email || contact.phone || "No contact info"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={contact.status === 1 ? "default" : "secondary"}>
                {contact.status === 1 ? "Active" : "Inactive"}
              </Badge>
              {interactions.length > 0 && (
                <Badge variant="outline">{interactions.length} interactions</Badge>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Type: </span>
                {contact.contact_type || "-"}
              </div>
              <div>
                <span className="font-medium">Phone: </span>
                {contact.phone || "-"}
              </div>
              {contact.notes && (
                <div className="col-span-2">
                  <span className="font-medium">Notes: </span>
                  {contact.notes}
                </div>
              )}
            </div>
            {interactions.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-sm mb-2">Interactions:</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interactions.map((interaction: any) => (
                      <TableRow key={interaction.id}>
                        <TableCell>{interaction.interaction_type || "-"}</TableCell>
                        <TableCell>{interaction.notes || "-"}</TableCell>
                        <TableCell>
                          {interaction.created_at
                            ? new Date(interaction.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {!loading && interactions.length === 0 && (
              <p className="text-sm text-muted-foreground">No interactions</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

