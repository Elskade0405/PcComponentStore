namespace PcComponentStore.Api.DTOs
{
    public class ChatRequestDto
    {
        public int? UserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
