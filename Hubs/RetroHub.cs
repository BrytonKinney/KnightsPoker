using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using KnightsPoker.Poker;
using Microsoft.AspNetCore.SignalR;

namespace KnightsPoker.Hubs
{
    public class RetroHub : Hub
    {
        private static ConcurrentBag<PokerItem<string>> _sharedContext = new ConcurrentBag<PokerItem<string>>();

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("StateReceived", _sharedContext);
        }

        public async Task ClearBoard() 
        {
            _sharedContext.Clear();
            await Clients.All.SendAsync("StateReceived", _sharedContext);
        }
        public async Task SubmitItem(PokerItem<string> item)
        {
            _sharedContext.Add(item);
            await Clients.All.SendAsync("ReceiveMessage", item);
        }
    }
}