<?php
// Configurazione: Inserisci qui la tua vera email quando sarai pronto
$to = "emaildiprova@example.com"; 
$subject = "Nuova richiesta di preventivo dal sito Ti Riparo";

// Risposta in JSON
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Raccogli e sanifica i dati per sicurezza
    $name = strip_tags(trim($_POST["name"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"] ?? ''));
    $service = strip_tags(trim($_POST["service"] ?? ''));
    $message = strip_tags(trim($_POST["message"] ?? ''));

    // Validazione base
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Per favore, compila tutti i campi obbligatori."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "L'indirizzo email non è valido."]);
        exit;
    }

    // Costruisci il contenuto dell'email
    $email_content = "Hai ricevuto una nuova richiesta dal tuo sito web Ti Riparo.\n\n";
    $email_content .= "Dettagli del contatto:\n";
    $email_content .= "Nome: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefono: $phone\n";
    $email_content .= "Servizio d'interesse: $service\n\n";
    $email_content .= "Messaggio:\n$message\n";

    // Intestazioni dell'email
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Invia l'email usando la funzione mail() di PHP (standard sui server Linux)
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Messaggio inviato con successo!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Si è verificato un errore sul server durante l'invio del messaggio."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
}
?>
