import { PokerClient, PokerItemType } from './poker';

enum RetroItemType {
    StartDoing = PokerItemType.StartDoing,
    StopDoing = PokerItemType.StopDoing,
    ContinueDoing = PokerItemType.ContinueDoing
}
class RetroClient extends PokerClient {
    constructor() {
        super("retro");
    }
    async addActionAsync(itemType: PokerItemType, user: string, message: string): Promise<void> {
        await this.submitItemAsync({ itemType, value: message, user });
    }
    async addContinueDoingAsync(user: string, message: string): Promise<void> {
        await this.addActionAsync(PokerItemType.ContinueDoing, user, message);
    }
    async addStartDoingAsync(user: string, message: string): Promise<void> {
        await this.addActionAsync(PokerItemType.StartDoing, user, message);
    }
    async addStopDoingAsync(user: string, message: string): Promise<void> {
        await this.addActionAsync(PokerItemType.StopDoing, user, message);
    }
}

export { RetroClient, RetroItemType };