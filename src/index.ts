import { RetroClient } from './retro';
import { IPokerItem, PokerItemType } from './poker';

function addItem(pokerItem: IPokerItem<string>) {
    var li = document.createElement("li");
    li.textContent = `${pokerItem.value} - ${pokerItem.user}`;
    li.setAttribute('data-user', pokerItem.user);
    console.log(pokerItem.value);
    console.log(pokerItem.itemType);
    switch (pokerItem.itemType) {
        case PokerItemType.StartDoing:
            document.getElementById("startDoingList").appendChild(li);
            break;
        case PokerItemType.StopDoing:
            document.getElementById("stopDoingList").appendChild(li);
            break;
        case PokerItemType.ContinueDoing:
            document.getElementById("continueDoingList").appendChild(li);
            break;
    }
}

let client = new RetroClient();

document.getElementById("sendButton").addEventListener("click", async (event) => {
    var user = (document.getElementById("username") as HTMLInputElement).value;
    var message = (document.getElementById("messageInput") as HTMLInputElement).value;
    var category = (document.getElementById("category") as HTMLSelectElement).value;
    try {
        await client.addActionAsync(parseInt(category), user, message);
    } catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});
document.getElementById("clearButton").addEventListener("click", async (event) => {
    try {
        await client.clearStateAsync();
    } catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});
async function clearList(listElement: HTMLElement) {
    while(listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
}

// We need an async function in order to use await, but we want this code to run immediately,
// so we use an "immediately-executed async function"
(async () => {
    try {
        client.registerItemCallback("ReceiveMessage", addItem);
        client.registerItemCallback("StateReceived", async function (itemsState: IPokerItem<string>[]) {
            let startDoingList = document.getElementById("startDoingList");
            let stopDoingList = document.getElementById("stopDoingList");
            let continueDoingList = document.getElementById("continueDoingList");
            await clearList(startDoingList);
            await clearList(stopDoingList);
            await clearList(continueDoingList);
            for (const item of itemsState) {
                addItem(item);
            }
        });
        client.connection.start().then(async fulfilled => {
            //  console.log(await client.requestStateAsync());
            console.log("Successfully connected!");
        }, async rejected => {
            console.error(rejected);
        }).catch(e => {
            console.error(e);
        });
    } catch (e) {
        console.error(e.toString());
    }
})();