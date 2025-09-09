"use client";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ContactsPage() {
  const contacts = useQuery(api.contactusform.getAllContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set()
  );

  const formatDate = (ts: number | undefined) => {
    if (!ts) return "-";
    const asNumber = Number(ts);
    const maybeMs = asNumber < 10000000000 ? asNumber * 1000 : asNumber;
    return new Date(maybeMs).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleMessageExpansion = (id: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMessages(newExpanded);
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (!message) return "—";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const filteredContacts = contacts?.filter(
    (contact: any) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (contacts === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-8 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mt-20 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contact Submissions
            </h1>
            <p className="text-gray-600">
              Manage and review customer inquiries
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-500">
              Contact form submissions will appear here when customers reach
              out.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mt-20 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Submissions
          </h1>
          <p className="text-gray-600">
            {contacts.length}{" "}
            {contacts.length === 1 ? "submission" : "submissions"} total
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or message..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredContacts?.length || 0} of {contacts.length}{" "}
              submissions
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Message
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts?.map((contact: any) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.name || "—"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email || "—"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {contact.subject || "—"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-md">
                        <div className="text-sm text-gray-700">
                          {expandedMessages.has(contact._id) ? (
                            <span>{contact.message || "—"}</span>
                          ) : (
                            <span>{truncateMessage(contact.message)}</span>
                          )}
                        </div>
                        {contact.message && contact.message.length > 100 && (
                          <button
                            onClick={() => toggleMessageExpansion(contact._id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                          >
                            {expandedMessages.has(contact._id)
                              ? "Show less"
                              : "Show more"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredContacts?.map((contact: any) => (
            <div
              key={contact._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {contact.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {contact.email || "No email provided"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              </div>

              {contact.subject && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Subject
                  </h4>
                  <p className="text-sm text-gray-700">{contact.subject}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Message
                </h4>
                <div className="text-sm text-gray-700">
                  {expandedMessages.has(contact._id) ? (
                    <p className="whitespace-pre-wrap">
                      {contact.message || "No message provided"}
                    </p>
                  ) : (
                    <p>
                      {truncateMessage(
                        contact.message || "No message provided"
                      )}
                    </p>
                  )}
                </div>
                {contact.message && contact.message.length > 100 && (
                  <button
                    onClick={() => toggleMessageExpansion(contact._id)}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium"
                  >
                    {expandedMessages.has(contact._id)
                      ? "Show less"
                      : "Show more"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {searchTerm && filteredContacts?.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or clear the search to see all
              submissions.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
