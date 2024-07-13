from bip_utils import Bip39MnemonicGenerator
import binascii

# Your private key
private_key_hex = "8ffc0397348a0ac006b9b6a7ce52652df9748d028f2ecc7c9aa78aae4e779fc9"

# Convert the private key to bytes
private_key_bytes = binascii.unhexlify(private_key_hex)

# Generate mnemonic from private key bytes
mnemonic = Bip39MnemonicGenerator().FromEntropy(private_key_bytes)

print(f"Mnemonic: {mnemonic}")