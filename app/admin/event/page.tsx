import { getAdminEvents } from "@/lib/data/events";
import EventClient from "@/components/admin/EventClient";

export const metadata = { title: "Event" };

export default async function AdminEventPage() {
  const events = await getAdminEvents();
  return <EventClient events={events} />;
}
