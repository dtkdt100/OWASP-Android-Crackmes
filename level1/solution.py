import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

key = bytes.fromhex("8d127684cbc37c17616d806cf50473cc")
msg = base64.b64decode("5UJiFctbmgbDoLXmpL12mkno8HT4Lv8dlat8FxR2GOc=")

pt = unpad(AES.new(key, AES.MODE_ECB).decrypt(msg), 16).decode()

print(pt)  # I want to believe
