import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { PropertyForm, PropertyList } from '@/components/property-form'

async function getProperties() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const organisationId = cookieStore.get('current_organisation_id')?.value

  if (!organisationId) {
    return []
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return data || []
}

function PropertiesLoading() {
  return (
    <div className="mt-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function PropertiesContent() {
  const properties = await getProperties()

  return <PropertyList initialProperties={properties} />
}

export default async function PropertiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const currentOrgId = cookieStore.get('current_organisation_id')?.value

  if (!currentOrgId) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Properties
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please select an organisation to view properties.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Properties
        </h1>
        <PropertyForm />
      </div>

      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent />
      </Suspense>
    </div>
  )
}
