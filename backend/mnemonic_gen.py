from bip_utils import Bip39MnemonicGenerator
import binascii
import os

""" # Your private key
private_key_hex = "8ffc0397348a0ac006b9b6a7ce52652df9748d028f2ecc7c9aa78aae4e779fc9"

# Convert the private key to bytes
private_key_bytes = binascii.unhexlify(private_key_hex)

# Generate mnemonic from private key bytes
mnemonic = Bip39MnemonicGenerator().FromEntropy(private_key_bytes)

print(f"Mnemonic: {mnemonic}")

# from mnemonic to private key

 """

# from mnemonic generate the private_key_hex with Bip39
from web3 import Web3
from eth_account import Account

Account.enable_unaudited_hdwallet_features()
# Replace the below string with your actual mnemonic
# import from env
mnemonic = os.getenv("MNEMONIC")
# Generate seed from mnemonic
seed = Web3.to_bytes(text=mnemonic)
# Derive the private key
account = Account.from_mnemonic(mnemonic)

print("Private Key:", account._private_key.hex())
