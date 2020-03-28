import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
enum PokerItemType {
    ContinueDoing = 3,
    StartDoing = 1,
    StopDoing = 2,
    Points = 4
}
interface IPokerItem<T> {
    itemType: PokerItemType;
    value: T;
    user: string;
}
interface IPokerState<T> {
    pokerItems: IPokerItem<T>[];
}
interface IPokerClient {
    connection: HubConnection;
    submitItemAsync<T>(item: IPokerItem<T>): Promise<void>;
}

class PokerClient implements IPokerClient {
    connection: HubConnection;
    state: any;
    constructor(hubName: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`/${hubName}`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
    }
    async clearStateAsync() : Promise<void> {
        await this.connection.invoke("ClearBoard").then(resp => {
            console.log("Cleared state.");
        }).catch(err => {
            console.error(err);
        })
    }
    async submitItemAsync<T>(item: IPokerItem<T>): Promise<void> {
        await this.connection.invoke("SubmitItem", item).then(resp => {
            console.log(resp);
        }).catch(err => console.error(err));
    }

    registerItemCallback<T>(eventName: string, callback: (pokerItem: T) => void): void {
        this.connection.on(eventName, callback);
    }
}

export { IPokerItem, PokerClient, IPokerClient, PokerItemType };