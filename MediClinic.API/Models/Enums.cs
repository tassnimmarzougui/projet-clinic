using System.Text.Json.Serialization;

namespace MediClinic.API.Models
{
    // الـ JsonStringEnumConverter يخلي الـ Swagger والـ Front يراو الكلمة (مثلا "Male") عوضا عن الرقم (0)
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Gender
    {
        Male,
        Female,
        Other
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PaymentStatus
    {
        Paid,
        Unpaid,
        PartiallyPaid,
        Refunded
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PaymentMethod
    {
        Cash,
        CreditCard,
        Insurance,
        BankTransfer
    }
}