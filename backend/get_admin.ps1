Add-Type -Path "F:\workspace\PcComponentStore\backend\bin\Debug\net8.0\MySqlConnector.dll"
$conn = New-Object MySqlConnector.MySqlConnection("Server=localhost;Database=pccomdb;User=root;Password=1234;")
$conn.Open()
$cmd = $conn.CreateCommand()
$cmd.CommandText = "SELECT email, password_hash FROM users WHERE role_type='admin'"
$reader = $cmd.ExecuteReader()
while ($reader.Read()) {
    Write-Host "Email: $($reader.GetString(0)) - Password: $($reader.GetString(1))"
}
$conn.Close()
