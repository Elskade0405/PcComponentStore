$body = @{
    customerName = "Test"
    phone = "123"
    email = "test@test.com"
    address = "Test Address"
    totalAmount = 1000
    paymentMethod = "COD"
    items = @(
        @{
            productId = 1
            quantity = 1
            unitPrice = 1000
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5285/api/orders" -Method Post -Body $body -ContentType "application/json"
