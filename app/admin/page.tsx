import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin-dashboard';
export default async function AdminPage(){if(!await currentAdmin())redirect('/admin/login');return <AdminDashboard/>}
