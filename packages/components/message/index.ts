import { withInstallFunction } from '@simple-ui/common/utils/vue/install'

import MessageCom from './method'

// export function as install func will exec at the first time
export const Message = withInstallFunction(MessageCom, '$message')
