/**

*/

import {
  CMS,
  CMSConfig,
  CMSEvent,
  MediaUploadOptions,
  PluginType,
} from './packages/core'
import { FieldPlugin } from './packages/form-builder'
import { ScreenPlugin } from './packages/react-screens'
import {
  TextFieldPlugin,
  TextareaFieldPlugin,
  ImageFieldPlugin,
  ColorFieldPlugin,
  NumberFieldPlugin,
  MdxFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  RadioGroupFieldPlugin,
  GroupFieldPlugin,
  GroupListFieldPlugin,
  ListFieldPlugin,
  BlocksFieldPlugin,
  TagsFieldPlugin,
  DateFieldPlugin,
  CheckboxGroupFieldPlugin,
  ReferenceFieldPlugin,
  ButtonToggleFieldPlugin,
  HiddenFieldPlugin,
} from './packages/fields'
import { Form } from './packages/forms'
import { Alerts, EventsToAlerts } from './packages/alerts'
import { SidebarState, SidebarStateOptions } from './packages/react-sidebar'
import {
  MarkdownFieldPlaceholder,
  HtmlFieldPlaceholder,
} from './plugins/fields/markdown'
import { MediaManagerScreenPlugin } from './plugins/screens/media-manager-screen'
import { createCloudConfig } from './packages/react-cloud-config'
import { TinaAction, TinaState } from './tina-state'

const DEFAULT_FIELDS = [
  TextFieldPlugin,
  TextareaFieldPlugin,
  ImageFieldPlugin,
  ColorFieldPlugin,
  NumberFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  MdxFieldPlugin,
  RadioGroupFieldPlugin,
  GroupFieldPlugin,
  GroupListFieldPlugin,
  ListFieldPlugin,
  BlocksFieldPlugin,
  TagsFieldPlugin,
  DateFieldPlugin,
  MarkdownFieldPlaceholder,
  HtmlFieldPlaceholder,
  CheckboxGroupFieldPlugin,
  ReferenceFieldPlugin,
  ButtonToggleFieldPlugin,
  HiddenFieldPlugin,
]

export interface TinaCMSConfig extends CMSConfig {
  sidebar?: SidebarStateOptions | boolean
  alerts?: EventsToAlerts
  isLocalClient?: boolean
  clientId?: string
  title?: string
  logoUrl?: string
}

export class TinaCMS extends CMS {
  sidebar?: SidebarState
  _alerts?: Alerts
  state: TinaState
  title?: string
  logoUrl?: string
  dispatch: React.Dispatch<TinaAction>

  constructor({
    sidebar,
    alerts = {},
    isLocalClient,
    clientId,
    title = 'PandoSoft',
    logoUrl,
    ...config
  }: TinaCMSConfig = {}) {
    super(config)

    this.alerts.setMap({
      'media:upload:failure': (
        event: CMSEvent & { error: Error; uploaded: MediaUploadOptions[] }
      ) => {
        return {
          error: event.error,
          level: 'error',
          message: `Failed to upload file(s) ${event?.uploaded
            .map((x) => x.file.name)
            .join(', ')}. See error message: \n\n ${event?.error.toString()}`,
        }
      },
      'media:delete:failure': () => ({
        level: 'error',
        message: 'Failed to delete file.',
      }),
      ...alerts,
    })

    if (sidebar) {
      const sidebarConfig = typeof sidebar === 'object' ? sidebar : undefined
      this.sidebar = new SidebarState(this.events, sidebarConfig)
    }

    DEFAULT_FIELDS.forEach((field) => {
      if (!this.fields.find(field.name)) {
        this.fields.add(field)
      }
    })
    this.plugins.add(MediaManagerScreenPlugin)
    if (isLocalClient !== true) {
      if (clientId) {
        this.plugins.add(
          createCloudConfig({
            name: 'Project Config',
            link: {
              text: 'Project Config',
              href: `https://app.tina.io/projects/${clientId}/overview`,
            },
          })
        )
        this.plugins.add(
          createCloudConfig({
            name: 'User Management',
            link: {
              text: 'User Management',
              href: `https://app.tina.io/projects/${clientId}/collaborators`,
            },
          })
        )
      } else {
        this.plugins.add(
          createCloudConfig({
            name: 'Setup Cloud',
            text: 'No project configured, set one up ',
            link: {
              text: 'here',
              href: `https://app.tina.io`,
            },
          })
        )
      }
    }
  }

  get alerts() {
    if (!this._alerts) {
      this._alerts = new Alerts(this.events)
    }
    return this._alerts
  }

  registerApi(name: string, api: any) {
    if (api.alerts) {
      this.alerts.setMap(api.alerts)
    }
    super.registerApi(name, api)
  }

  get forms(): PluginType<Form> {
    return this.plugins.findOrCreateMap<Form & { __type: string }>('form')
  }

  get fields(): PluginType<FieldPlugin> {
    return this.plugins.findOrCreateMap('field')
  }

  get screens(): PluginType<ScreenPlugin> {
    return this.plugins.findOrCreateMap('screen')
  }
  removeAllForms() {
    this.forms.all().forEach((form) => {
      this.forms.remove(form)
    })
  }

  /**
   * When a form is associated with any queries
   * it's considered orphaned.
   */
  removeOrphanedForms() {
    const orphanedForms = this.forms
      .all()
      .filter((form) => form.queries.length === 0)
    orphanedForms.forEach((form) => {
      this.forms.remove(form)
    })
  }
}
