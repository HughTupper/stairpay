'use client'

import { useActionState, useOptimistic, useState } from 'react'
import { createProperty } from '@/actions/properties'

type Property = {
  id: string
  address: string
  postcode: string
  property_value: number
  created_at: string
}

export function PropertyForm() {
  const [state, formAction, isPending] = useActionState(createProperty, {})
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Add Property
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add New Property
          </h3>
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="123 High Street, London"
              />
            </div>

            <div>
              <label
                htmlFor="postcode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Postcode
              </label>
              <input
                type="text"
                name="postcode"
                id="postcode"
                required
                className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="SW1A 1AA"
              />
            </div>

            <div>
              <label
                htmlFor="propertyValue"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Property Value (£)
              </label>
              <input
                type="number"
                name="propertyValue"
                id="propertyValue"
                required
                step="0.01"
                min="0"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="250000"
              />
            </div>

            {state.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{state.error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Creating...' : 'Create Property'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

type PropertyListProps = {
  initialProperties: Property[]
}

export function PropertyList({ initialProperties }: PropertyListProps) {
  const [optimisticProperties] = useOptimistic(
    initialProperties,
    (state: Property[], newProperty: Property) => [...state, newProperty]
  )

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Properties
      </h2>
      {optimisticProperties.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No properties
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new property.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {optimisticProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {property.address}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {property.postcode}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-4">
                £{property.property_value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Added {new Date(property.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
