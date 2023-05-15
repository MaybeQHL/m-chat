import _MChat from './components/MChat.vue'
import { withInstall } from './with-install';

export * from './type';
export * from './enum';

export type { Config } from './type'
export type { MessageData } from './type'



const MChat = withInstall<typeof _MChat>(_MChat);

export default MChat

