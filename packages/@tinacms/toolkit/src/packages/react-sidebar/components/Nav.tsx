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
                  <svg
                    className="w-25 h-auto -ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#FF6131"
                    version="1.1"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 850 115"
                  >
                    <style type="text/css"></style>
                    <g>
                      <polygon
                        className="st0"
                        points="4.2,108.9 4.2,108.9 4.2,89.4 46.9,89.4 47,89.4 89.7,89.4 89.7,108.9  "
                      />
                      <polygon
                        className="st0"
                        points="80.7,27.8 70.5,12.9 70.5,12.9 56,22.8 56,5.2 37.9,5.2 37.9,5.2 37.9,22.8 23.4,12.9 23.4,12.9    13.2,27.8 30.9,40 13.2,52.1 23.4,67.1 37.9,57.1 37.9,74.7 56,74.7 56,57.1 70.5,67.1 80.7,52.1 63,40  "
                      />
                    </g>
                    <g style={{ fill: 'black' }}>
                      <path d="M184.8,44c0,7.4-1.6,13.6-4.8,18.4c-3.2,4.8-7.6,8.5-13.4,10.8c-5.7,2.4-12.4,3.6-20,3.6h-10.3v31.9h-22.7v-96h30.2   c13,0,23.1,2.6,30.3,7.8C181.2,25.7,184.8,33.6,184.8,44z M161.4,44.1c0-3.4-0.6-6.2-1.9-8.5c-1.3-2.2-3.2-3.9-5.8-5   c-2.6-1.1-5.8-1.6-9.7-1.6h-7.7v31.4h8.9c3.4,0,6.3-0.6,8.7-1.7c2.4-1.2,4.2-2.9,5.5-5.3C160.8,50.9,161.4,47.9,161.4,44.1z" />
                      <path d="M259.6,87.6c0,2.8,0.4,4.8,1.1,6s2,2.2,3.7,2.8l-4.5,14.4c-4.3-0.4-8-1.4-11-2.9s-5.3-3.8-7-6.8c-2.8,3.4-6.4,5.9-10.8,7.5   s-8.9,2.5-13.4,2.5c-7.6,0-13.6-2.2-18.1-6.5s-6.8-9.9-6.8-16.7c0-8,3.1-14.2,9.4-18.5s15.1-6.5,26.4-6.5h9.9v-2.8   c0-3.8-1.2-6.7-3.7-8.5s-6.1-2.8-10.8-2.8c-2.4,0-5.4,0.3-9.1,1s-7.4,1.6-11.1,2.9l-5.1-14.5c4.8-1.8,9.7-3.2,14.9-4.1   c5.1-0.9,9.8-1.4,13.8-1.4c10.9,0,19,2.2,24.3,6.7c5.2,4.5,7.9,10.9,7.9,19.3L259.6,87.6L259.6,87.6z M225.4,95.6   c2.4,0,4.8-0.7,7.4-2.1c2.6-1.4,4.5-3.4,5.9-6V75.6h-5.4c-6.1,0-10.6,0.9-13.4,2.8c-2.9,1.9-4.3,4.6-4.3,8.2c0,2.8,0.9,5,2.6,6.6   C219.8,94.7,222.3,95.6,225.4,95.6z" />
                      <path d="M280.9,108.8V35.2H300l1.5,8.5c3.3-3.7,6.7-6.4,10.4-8.2c3.6-1.8,7.8-2.7,12.5-2.7c6.3,0,11.2,1.9,14.8,5.8   c3.6,3.8,5.4,9.2,5.4,16.2v54h-21.9V61.1c0-3-0.2-5.4-0.6-7.2c-0.4-1.8-1.1-3-2.2-3.8c-1-0.8-2.5-1.1-4.3-1.1c-1.5,0-3,0.3-4.5,1   s-2.9,1.6-4.3,2.9c-1.4,1.2-2.8,2.7-4.2,4.5v51.5L280.9,108.8L280.9,108.8z" />
                      <path d="M405.8,3.7L427.8,6v102.8h-19.4l-1.1-8.1c-2,2.9-4.7,5.3-8.1,7.4c-3.4,2.1-7.5,3.1-12.3,3.1c-6.1,0-11.1-1.6-15.1-4.9   c-4-3.3-7-7.9-8.9-13.8c-2-5.9-2.9-12.8-2.9-20.7c0-7.6,1.2-14.3,3.5-20.2c2.4-5.9,5.7-10.5,10.1-13.8s9.6-5,15.7-5   c3.3,0,6.3,0.6,9.1,1.7c2.8,1.2,5.3,2.8,7.6,5.1V3.7H405.8z M395,48.8c-3.8,0-6.8,1.8-9.1,5.4c-2.3,3.6-3.5,9.5-3.5,17.8   c0,6.1,0.5,10.8,1.5,14.1s2.3,5.7,4,7s3.7,2,5.9,2c2.4,0,4.7-0.8,6.7-2.3s3.8-3.6,5.4-6.2V54.9c-1.5-1.9-3.1-3.4-4.8-4.4   C399.2,49.4,397.2,48.8,395,48.8z" />
                      <path d="M479,32.8c7.6,0,14,1.6,19.3,4.8c5.3,3.2,9.4,7.8,12.2,13.6s4.2,12.7,4.2,20.5c0,8.2-1.4,15.2-4.3,21.1   c-2.8,5.9-6.9,10.4-12.2,13.5s-11.7,4.7-19.3,4.7c-7.5,0-13.9-1.5-19.2-4.6s-9.4-7.6-12.3-13.4c-2.8-5.9-4.3-12.9-4.3-21.1   c0-7.8,1.4-14.6,4.3-20.5c2.8-5.9,6.9-10.4,12.3-13.7C465.2,34.5,471.5,32.8,479,32.8z M479,49c-4.5,0-7.8,1.8-9.9,5.5   c-2.1,3.7-3.2,9.5-3.2,17.5c0,8.1,1.1,14,3.2,17.7c2.1,3.6,5.5,5.5,9.9,5.5c4.5,0,7.8-1.8,9.9-5.5c2.1-3.6,3.2-9.6,3.2-17.8   c0-7.9-1.1-13.7-3.2-17.4C486.8,50.8,483.5,49,479,49z" />
                      <path d="M599.2,80.8c0,6-1.6,11.2-4.7,15.8c-3.1,4.6-7.6,8.2-13.4,10.7c-5.8,2.6-12.8,3.9-21,3.9c-9.1,0-16.6-1.3-22.8-4   c-6.1-2.7-11.2-5.9-15.2-9.9l11.5-12.7c3.6,3.1,7.5,5.5,11.8,7.2s9,2.5,14.1,2.5c3.2,0,6-0.5,8.4-1.4s4.3-2.3,5.6-4   c1.3-1.8,2-3.9,2-6.4c0-2.4-0.5-4.3-1.6-6c-1.1-1.6-2.9-3.1-5.4-4.4c-2.5-1.3-6-2.6-10.5-3.9c-7.5-2.3-13.5-4.8-18-7.6   c-4.6-2.8-7.9-6-9.9-9.6c-2.1-3.6-3.1-7.9-3.1-12.7c0-5.9,1.6-10.9,4.9-15c3.3-4.2,7.6-7.3,13.1-9.5s11.5-3.3,18.2-3.3   c7.4,0,14,1.1,19.7,3.2s10.6,5.2,14.8,9.2L587,35.1c-3.2-2.7-6.7-4.7-10.5-6.1c-3.7-1.3-7.6-2-11.4-2c-2.9,0-5.4,0.4-7.6,1.1   c-2.2,0.7-3.9,1.8-5.1,3.2c-1.2,1.4-1.8,3.1-1.8,5.2c0,2,0.6,3.7,1.7,5.1c1.2,1.4,3.2,2.7,6,3.9c2.9,1.2,6.8,2.6,11.9,4.3   c6,1.8,11.2,4.1,15.6,6.6c4.3,2.6,7.6,5.8,9.9,9.7C598.2,70.1,599.2,74.9,599.2,80.8z" />
                      <path d="M645.2,32.8c7.6,0,14,1.6,19.3,4.8c5.3,3.2,9.4,7.8,12.2,13.6s4.2,12.7,4.2,20.5c0,8.2-1.4,15.2-4.3,21.1   c-2.8,5.9-6.9,10.4-12.2,13.5s-11.7,4.7-19.3,4.7c-7.5,0-13.9-1.5-19.2-4.6s-9.4-7.6-12.3-13.4c-2.8-5.9-4.3-12.9-4.3-21.1   c0-7.8,1.4-14.6,4.3-20.5c2.8-5.9,6.9-10.4,12.3-13.7C631.3,34.5,637.8,32.8,645.2,32.8z M645.2,49c-4.5,0-7.8,1.8-9.9,5.5   c-2.1,3.7-3.2,9.5-3.2,17.5c0,8.1,1.1,14,3.2,17.7c2.1,3.6,5.5,5.5,9.9,5.5s7.8-1.8,9.9-5.5c2.1-3.6,3.2-9.6,3.2-17.8   c0-7.9-1.1-13.7-3.2-17.4C653,50.8,649.8,49,645.2,49z" />
                      <path d="M743.3,3.7c5.4,0,10.1,0.4,14.2,1.3c4.1,0.9,7.8,2,11,3.4l-6,14.3c-2.5-1-5.2-1.7-7.8-2.1c-2.7-0.4-5.3-0.7-8-0.7   c-4.3,0-7.4,0.8-9.3,2.4c-1.9,1.6-2.8,4.2-2.8,7.8v9.8h24l-2.4,15.2h-21.5v53.8H713V55.1h-15.4V39.9H713V29.2c0-4.8,1.2-9.2,3.5-13   s5.7-6.9,10.3-9.1C731.2,4.8,736.8,3.7,743.3,3.7z" />
                      <path d="M845.8,104.6c-2.9,1.8-6.3,3.4-10.4,4.7c-4.1,1.3-8.6,1.9-13.7,1.9c-9.6,0-16.7-2.5-21.4-7.4s-7-11.6-7-20.1V50.3h-15.4   V35.2h15.4V19.3l21.9-2.6v18.6h23.7l-2.1,15.1h-21.6v33.4c0,3.6,0.8,6.3,2.5,7.8c1.7,1.6,4.3,2.4,8,2.4c2.6,0,5-0.3,7.1-0.9   c2.1-0.6,4.1-1.4,5.8-2.4L845.8,104.6z" />
                    </g>
                  </svg>

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
