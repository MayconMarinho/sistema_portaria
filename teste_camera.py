import cv2
import face_recognition

# Inicia a captura de vídeo da webcam padrão do PC (índice 0)
video_capture = cv2.VideoCapture(0)

print("Câmera ligada! Pressione a tecla 'q' no seu teclado para sair da janela.")

while True:
    # Captura um único frame (quadro) do vídeo
    ret, frame = video_capture.read()

    # A biblioteca procura por rostos no frame capturado
    face_locations = face_recognition.face_locations(frame)

    # Desenha um retângulo vermelho ao redor de cada rosto encontrado
    for (top, right, bottom, left) in face_locations:
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 3)

    # Mostra o resultado do vídeo em uma nova janela
    cv2.imshow('Teste de Detecao Facial - Acos F Sacchelli', frame)

    # Aguarda a tecla 'q' ser pressionada para encerrar o programa
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Quando terminar, libera a câmera e fecha a janela
video_capture.release()
cv2.destroyAllWindows()