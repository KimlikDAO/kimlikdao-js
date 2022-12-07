import { keccak256 } from "/crypto/sha3";
import evm from "/ethereum/evm";
import { assertEq, assertStats } from "/testing/assert";

const digest = (msg) => keccak256("\x19Ethereum Signed Message:\n" + msg.length + msg);

assertEq(evm.recoverSignerAddress(
  digest("140e575468d2a8dcbcc437e0f12e37606491f1621fe71239b99b793cd590b7f4"),
  evm.compactSignature("0x278f49cb66db8b104751fe3413dbf50e58288e66b625fa704b33255d060122956dc164431e9b78805da4bb590d2a8f7a340c89ed74ec04d054a3b49977ec6b4a1c")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.recoverSignerAddress(
  digest("92c0aea56bd108db8f41000707872c9e5f72bd79c10d9285ddf0e32c51791948"),
  evm.compactSignature("0x9400092866ff50e1d88014ca3cc3d878f6cecacc5ae8f752f3874c0b0584a90f462f2947f7fbc119843e3c4319dc2da3cbb482745d42dd0e5a1cd27033270cbd1b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.recoverSignerAddress(
  digest("3e38bda94a98f1b3019dd7b48e050cbb18986724d1cfd29ceb9c8e57c7351866"),
  evm.compactSignature("0x09af513d1be6760e9a2e6bfa9b2166b337c2e2f830a3b75b01f41b25804c371044065ee77b34b36fd8a8ea9bda7acf4fd5ab7bf56879a33df8293d744784cb1e1b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertStats();
