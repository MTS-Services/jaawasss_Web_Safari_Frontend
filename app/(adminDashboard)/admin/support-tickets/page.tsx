"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	getAdminCustomerSupportTickets,
	type CustomerSupportTicket,
	type CustomerSupportTicketPriority,
	type CustomerSupportTicketStatus,
} from "@/lib/api/admin-customer-support-tickets"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Ticket, UserRound, Building2, Mail, CalendarDays } from "lucide-react"

function statusLabel(status: CustomerSupportTicketStatus): string {
	if (status === "in_progress") return "In Progress"
	if (status === "waiting_on_customer") return "Waiting On Customer"
	if (status === "resolved") return "Resolved"
	if (status === "closed") return "Closed"
	if (status === "open") return "Open"
	return "Unknown"
}

function statusClass(status: CustomerSupportTicketStatus): string {
	if (status === "open") return "bg-amber-100 text-amber-700"
	if (status === "in_progress") return "bg-blue-100 text-blue-700"
	if (status === "waiting_on_customer") return "bg-orange-100 text-orange-700"
	if (status === "resolved") return "bg-green-100 text-green-700"
	if (status === "closed") return "bg-slate-100 text-slate-700"
	return "bg-muted text-muted-foreground"
}

function priorityClass(priority: CustomerSupportTicketPriority): string {
	if (priority === "urgent") return "bg-red-100 text-red-700"
	if (priority === "high") return "bg-orange-100 text-orange-700"
	if (priority === "medium") return "bg-blue-100 text-blue-700"
	if (priority === "low") return "bg-slate-100 text-slate-700"
	return "bg-muted text-muted-foreground"
}

export default function AdminSupportTicketsPage() {
	const { toast } = useToast()
	const [tickets, setTickets] = useState<CustomerSupportTicket[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [page, setPage] = useState(1)
	const [perPage] = useState(15)
	const [meta, setMeta] = useState<{
		currentPage: number
		lastPage: number
		total: number
		from: number | null
		to: number | null
	} | null>(null)

	useEffect(() => {
		let mounted = true

		const loadTickets = async () => {
			setIsLoading(true)
			const response = await getAdminCustomerSupportTickets(page, perPage)

			if (!mounted) return

			if (!response.success) {
				toast({
					title: "Failed to load support tickets",
					description: response.message || "Please refresh and try again.",
					variant: "destructive",
				})
				setTickets([])
				setMeta(null)
				setIsLoading(false)
				return
			}

			setTickets(response.data)
			setMeta(
				response.meta
					? {
							currentPage: response.meta.currentPage,
							lastPage: response.meta.lastPage,
							total: response.meta.total,
							from: response.meta.from,
							to: response.meta.to,
						}
					: null
			)
			setIsLoading(false)
		}

		void loadTickets()

		return () => {
			mounted = false
		}
	}, [page, perPage, toast])

	const counters = useMemo(
		() => ({
			open: tickets.filter((ticket) => ticket.status === "open").length,
			inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
			waitingOnCustomer: tickets.filter((ticket) => ticket.status === "waiting_on_customer").length,
			resolved: tickets.filter((ticket) => ticket.status === "resolved").length,
			closed: tickets.filter((ticket) => ticket.status === "closed").length,
		}),
		[tickets]
	)

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-serif text-2xl font-medium text-foreground">Support Tickets</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Endpoint: /admin/customer-supports/tickets with server-side pagination.
				</p>
			</div>

			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Open</p>
					<p className="mt-1 text-2xl font-semibold text-foreground">{counters.open}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">In Progress</p>
					<p className="mt-1 text-2xl font-semibold text-foreground">{counters.inProgress}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Waiting On Customer</p>
					<p className="mt-1 text-2xl font-semibold text-foreground">{counters.waitingOnCustomer}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Resolved</p>
					<p className="mt-1 text-2xl font-semibold text-foreground">{counters.resolved}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-sm text-muted-foreground">Closed</p>
					<p className="mt-1 text-2xl font-semibold text-foreground">{counters.closed}</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
				</div>
			) : tickets.length === 0 ? (
				<div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
					No support tickets found.
				</div>
			) : (
				<div className="space-y-4">
					{tickets.map((ticket) => (
						<div key={ticket.id} className="rounded-xl border border-border bg-card p-4">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<div className="flex items-center gap-2">
										<Ticket className="h-4 w-4 text-muted-foreground" />
										<span className="font-medium text-foreground">Ticket #{ticket.id}</span>
									</div>
									<h3 className="mt-1 font-semibold text-foreground">{ticket.subject}</h3>
								</div>

								<div className="flex flex-wrap gap-2">
									<Badge className={statusClass(ticket.status)}>{statusLabel(ticket.status)}</Badge>
									<Badge className={priorityClass(ticket.priority)}>{ticket.priority}</Badge>
								</div>
							</div>

							<div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
								<p className="flex items-center gap-2">
									<Building2 className="h-4 w-4" />
									Department: {ticket.departmentType}
								</p>
								<p className="flex items-center gap-2">
									<UserRound className="h-4 w-4" />
									Requester: {ticket.user?.fullName || "N/A"} ({ticket.user?.role || "unknown"})
								</p>
								<p className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									{ticket.user?.email || "N/A"}
								</p>
								<p className="flex items-center gap-2">
									<CalendarDays className="h-4 w-4" />
									Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}
								</p>
							</div>

							<p className="mt-2 text-xs text-muted-foreground">
								Assignee: {ticket.assignee?.fullName || "Unassigned"}
							</p>

							<div className="mt-3">
								<Button size="sm" variant="outline" asChild>
									<Link href={`/admin/customer-supports/tickets/${ticket.id}`}>View Ticket</Link>
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="rounded-lg border border-border bg-card px-4 py-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {meta?.from ?? 0} - {meta?.to ?? tickets.length} of {meta?.total ?? tickets.length}
					</div>

					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							disabled={isLoading || (meta ? meta.currentPage <= 1 : page <= 1)}
						>
							Previous
						</Button>
						<div className="text-sm text-muted-foreground">
							Page {meta?.currentPage ?? page} / {meta?.lastPage ?? 1}
						</div>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setPage((prev) => prev + 1)}
							disabled={isLoading || (meta ? meta.currentPage >= meta.lastPage : tickets.length < perPage)}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
