namespace KnightsPoker.Poker
{
    public class PokerItem<T>
    {
        public PokerItemType ItemType { get; set; }
        public T Value { get; set; }
        public string User { get; set; }
    }
}