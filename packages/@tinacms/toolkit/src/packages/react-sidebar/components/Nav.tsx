/**



*/

import * as React from 'react'
import { BiExit } from 'react-icons/bi'
import { FiMoreVertical, FiInfo } from 'react-icons/fi'
import { VscNewFile } from 'react-icons/vsc'
import { Menu, Transition } from '@headlessui/react'
import { updateBodyDisplacement } from './Sidebar'
import { FormModal } from '../../react-forms'
import { useEditState } from '@tinacms/sharedctx'
import type { ScreenPlugin } from '../../react-screens'
import { LoadingDots } from '../../form-builder'
import { SyncStatus, SyncErrorWidget, SyncStatusModal } from './SyncStatus'
import { useCMS } from '../../react-core'
import { CloudConfigPlugin } from '../../react-cloud-config'
interface NavProps {
  isLocalMode: boolean
  children?: any
  className?: string
  userName?: string
  title: string
  logoUrl: string
  showCollections: boolean
  collectionsInfo: {
    collections: { label?: string; name: string }[]
  }
  contentCreators?: any
  screens?: ScreenPlugin[]
  cloudConfigs?: CloudConfigPlugin[]
  sidebarWidth?: number
  RenderNavSite: React.ComponentType<{ view: ScreenPlugin }>
  RenderNavCloud: React.ComponentType<{ config: CloudConfigPlugin }>
  RenderNavCollection: React.ComponentType<{
    collection: { label: string; name: string }
  }>
}

export const Nav = ({
  isLocalMode,
  className = '',
  children,
  showCollections,
  collectionsInfo,
  screens,
  cloudConfigs,
  contentCreators,
  sidebarWidth,
  RenderNavSite,
  RenderNavCloud,
  RenderNavCollection,
  title,
  logoUrl,
  ...props
}: NavProps) => {
  const cms = useCMS()
  const { setEdit } = useEditState()
  const [eventsOpen, setEventsOpen] = React.useState(false)

  function closeEventsModal() {
    setEventsOpen(false)
  }

  return (
    <div
      className={`relative z-30 flex flex-col bg-white border-r border-gray-200 w-96 h-full ${className}`}
      style={{ maxWidth: sidebarWidth + 'px' }}
      {...props}
    >
      <div className="border-b border-gray-200">
        <Menu as="div" className="relative block">
          {({ open }) => (
            <div>
              <Menu.Button
                className={`group w-full px-6 py-3 gap-2 flex justify-between items-center transition-colors duration-150 ease-out ${
                  open ? `bg-gray-50` : `bg-transparent`
                }`}
              >
                <span className="text-left inline-flex items-center text-xl tracking-wide text-gray-800 flex-1 gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-150 ease-out">
                  {logoUrl != null ? (
                    <img
                      className="w-24 h-auto -ml-1"
                      src={logoUrl}
                      alt="Logo"
                    />
                  ) : (
                    <></>
                  )}
                  <span className="mx-auto">{title}</span>
                </span>
                <SyncErrorWidget cms={cms} />
                <FiMoreVertical
                  className={`flex-0 w-6 h-full inline-block group-hover:opacity-80 transition-all duration-300 ease-in-out transform ${
                    open
                      ? `opacity-100 text-blue-400`
                      : `text-gray-400 opacity-50 hover:opacity-70`
                  }`}
                />
              </Menu.Button>
              <div className="transform translate-y-full absolute bottom-3 right-5 z-50">
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform opacity-0 -translate-y-2"
                  enterTo="transform opacity-100 translate-y-0"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform opacity-100 translate-y-0"
                  leaveTo="transform opacity-0 -translate-y-2"
                >
                  <Menu.Items className="bg-white border border-gray-150 rounded-lg shadow-lg flex flex-col items-stretch overflow-hidden">
                    <Menu.Item>
                      <button
                        className={`text-lg px-4 py-2 first:pt-3 last:pb-3 tracking-wide whitespace-nowrap flex items-center opacity-80 text-gray-600 hover:text-blue-400 hover:bg-gray-50 hover:opacity-100`}
                        onClick={async () => {
                          updateBodyDisplacement({
                            displayState: 'closed',
                            sidebarWidth: null,
                            resizingSidebar: false,
                          })
                          if (cms?.api?.tina?.logout) {
                            await cms.api.tina.logout()
                            if (cms?.api?.tina?.onLogout) {
                              await cms?.api?.tina?.onLogout()
                            }
                          }
                          setEdit(false)
                        }}
                      >
                        <BiExit className="w-6 h-auto mr-2 text-blue-400" /> Log
                        Out
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <SyncStatus cms={cms} setEventsOpen={setEventsOpen} />
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </div>
            </div>
          )}
        </Menu>
      </div>
      {eventsOpen && (
        <SyncStatusModal cms={cms} closeEventsModal={closeEventsModal} />
      )}
      {children}
      <div className="px-6 flex-1 overflow-auto">
        {showCollections && (
          <>
            <h4 className="flex space-x-1 justify-items-start uppercase font-sans font-bold text-sm mb-3 mt-8 text-gray-700">
              <span>Collections</span>
              {isLocalMode && (
                <span className="flex items-center">
                  <a
                    href="https://tina.io/docs/schema/#defining-collections"
                    target="_blank"
                  >
                    <FiInfo />
                  </a>
                </span>
              )}
            </h4>
            <CollectionsList
              RenderNavCollection={RenderNavCollection}
              {...collectionsInfo}
            />
          </>
        )}
        {(screens.length > 0 || contentCreators.length) > 0 && (
          <>
            <h4 className="uppercase font-sans font-bold text-sm mb-3 mt-8 text-gray-700">
              Site
            </h4>
            <ul className="flex flex-col gap-4">
              {screens.map((view) => {
                return (
                  <li key={`nav-site-${view.name}`}>
                    <RenderNavSite view={view} />
                  </li>
                )
              })}

              {contentCreators.map((plugin, idx) => {
                return (
                  <CreateContentNavItem key={`plugin-${idx}`} plugin={plugin} />
                )
              })}
            </ul>
          </>
        )}
        {!!cloudConfigs?.length && (
          <>
            <h4 className="uppercase font-sans font-bold text-sm mb-3 mt-8 text-gray-700">
              Cloud
            </h4>
            <ul className="flex flex-col gap-4">
              {cloudConfigs.map((config) => {
                return (
                  <li key={`nav-site-${config.name}`}>
                    <RenderNavCloud config={config} />
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

const CollectionsList = ({
  collections,
  RenderNavCollection,
}: {
  collections: { label?: string; name: string }[]
  RenderNavCollection: React.ComponentType<{
    collection: { label?: string; name: string }
  }>
}) => {
  if (collections.length === 0) {
    return <div>No collections found</div>
  }

  return (
    <ul className="flex flex-col gap-4">
      {collections.map((collection) => {
        return (
          <li key={`nav-collection-${collection.name}`}>
            <RenderNavCollection collection={collection} />
          </li>
        )
      })}
    </ul>
  )
}

const CreateContentNavItem = ({ plugin }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <li key={plugin.name}>
      <button
        className="text-base tracking-wide text-gray-500 hover:text-blue-600 flex items-center opacity-90 hover:opacity-100"
        onClick={() => {
          setOpen(true)
        }}
      >
        <VscNewFile className="mr-3 h-6 opacity-80 w-auto" /> {plugin.name}
      </button>
      {open && <FormModal plugin={plugin} close={() => setOpen(false)} />}
    </li>
  )
}
