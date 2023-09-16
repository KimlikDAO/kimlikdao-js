import evm from "/ethereum/evm";
import { assertEq } from "/testing/assert";

assertEq(evm.signerAddress(
  evm.personalDigest("140e575468d2a8dcbcc437e0f12e37606491f1621fe71239b99b793cd590b7f4"),
  evm.compactSignature(
    "0x278f49cb66db8b104751fe3413dbf50e58288e66b625fa704b33255d06012295" +
    "6dc164431e9b78805da4bb590d2a8f7a340c89ed74ec04d054a3b49977ec6b4a1c")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("92c0aea56bd108db8f41000707872c9e5f72bd79c10d9285ddf0e32c51791948"),
  evm.compactSignature(
    "0x9400092866ff50e1d88014ca3cc3d878f6cecacc5ae8f752f3874c0b0584a90f" +
    "462f2947f7fbc119843e3c4319dc2da3cbb482745d42dd0e5a1cd27033270cbd1b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("3e38bda94a98f1b3019dd7b48e050cbb18986724d1cfd29ceb9c8e57c7351866"),
  evm.compactSignature(
    "0x09af513d1be6760e9a2e6bfa9b2166b337c2e2f830a3b75b01f41b25804c3710" +
    "44065ee77b34b36fd8a8ea9bda7acf4fd5ab7bf56879a33df8293d744784cb1e1b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("İmza, KimlikDAO"),
  evm.compactSignature(
    "0x6c8b90ce7867d3bab682a8d8ac47293e3b8e733b5c21843d9425da4de1fa4b4d" +
    "1495991af65b57164b042186c02bac62a292b3247e322aa4d1f9ab7519e87f4d1b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("Signed, KimlikDAO"),
  evm.compactSignature(
    "0xf0912fda0d8d456eaa711fa58c3788813fc7a0ebe3906f38a5b57f18dd379b69" +
    "3a7afde0f05e858af8be9d8c62ca03dac9d52dc9c8cc2c00a4d74cb875988dae1c")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("Çekoslovakyalılaştıramadıklarımızdanmışçasına"),
  evm.compactSignature(
    "0x8b00f90e6920617f49daad913d8492534d85a7dfc2a2ec0f8de149870fda62a5" +
    "0f7abf9b7488d8304deb635248e45ba65099d3bfc86ff43711311d4b4b18e1e41b")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);

assertEq(evm.signerAddress(
  evm.personalDigest("Öşür yoğuşturup, aşı kovuşturmak. Iğdır’ın ilk harfi ı’dır."),
  evm.compactSignature(
    "0x2a64a7063ca328bee1d612a327757389b73970598f0e964b1ef075de3937c198" +
    "728c381e23784ae164794f24bee158b569b20d17200315bcfacc7b6c0daae0601c")),
  "0x79883d9acbc4abac6d2d216693f66fcc5a0bcbc1"
);
