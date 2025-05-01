```rs [./benches/primitives.rs]
#![allow(unknown_lints, clippy::incompatible_msrv, missing_docs)]

use alloy_primitives::{keccak256, Address, B256};
use criterion::{criterion_group, criterion_main, Criterion};
use std::hint::black_box;

fn primitives(c: &mut Criterion) {
    let mut g = c.benchmark_group("primitives");
    g.bench_function("address/checksum", |b| {
        let address = Address::random();
        let out = &mut [0u8; 42];
        b.iter(|| {
            let x = address.to_checksum_raw(black_box(out), None);
            black_box(x);
        })
    });
    g.bench_function("keccak256/32", |b| {
        let mut out = B256::random();
        b.iter(|| {
            out = keccak256(out.as_slice());
            black_box(&out);
        });
    });
    g.finish();
}

criterion_group!(benches, primitives);
criterion_main!(benches);
```
```rs [./src/sealed.rs]
use crate::B256;
use derive_more::{AsRef, Deref};

/// A consensus hashable item, with its memoized hash.
///
/// We do not implement any specific hashing algorithm here. Instead types
/// implement the [`Sealable`] trait to provide define their own hash.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, AsRef, Deref)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(feature = "arbitrary", derive(proptest_derive::Arbitrary))]
pub struct Sealed<T> {
    /// The inner item.
    #[as_ref]
    #[deref]
    #[cfg_attr(feature = "serde", serde(flatten))]
    inner: T,
    #[cfg_attr(feature = "serde", serde(rename = "hash"))]
    /// Its hash.
    seal: B256,
}

impl<T> Sealed<T> {
    /// Seal the inner item.
    pub fn new(inner: T) -> Self
    where
        T: Sealable,
    {
        let seal = inner.hash_slow();
        Self { inner, seal }
    }

    /// Seal the inner item, by reference.
    pub fn new_ref(inner: &T) -> Sealed<&T>
    where
        T: Sealable,
    {
        let seal = inner.hash_slow();
        Sealed { inner, seal }
    }

    /// Seal the inner item with some function.
    pub fn new_with<F>(inner: T, f: F) -> Self
    where
        T: Sized,
        F: FnOnce(&T) -> B256,
    {
        let seal = f(&inner);
        Self::new_unchecked(inner, seal)
    }

    /// Seal a reference to the inner item with some function.
    pub fn new_ref_with<F>(inner: &T, f: F) -> Sealed<&T>
    where
        T: Sized,
        F: FnOnce(&T) -> B256,
    {
        let seal = f(inner);
        Sealed::new_unchecked(inner, seal)
    }

    /// Instantiate without performing the hash. This should be used carefully.
    pub const fn new_unchecked(inner: T, seal: B256) -> Self {
        Self { inner, seal }
    }

    /// Converts from `&Sealed<T>` to `Sealed<&T>`.
    pub const fn as_sealed_ref(&self) -> Sealed<&T> {
        Sealed { inner: &self.inner, seal: self.seal }
    }

    /// Decompose into parts.
    #[allow(clippy::missing_const_for_fn)] // false positive
    pub fn into_parts(self) -> (T, B256) {
        (self.inner, self.seal)
    }

    /// Decompose into parts. Alias for [`Self::into_parts`].
    #[allow(clippy::missing_const_for_fn)] // false positive
    pub fn split(self) -> (T, B256) {
        self.into_parts()
    }

    /// Clone the inner item.
    #[inline(always)]
    pub fn clone_inner(&self) -> T
    where
        T: Clone,
    {
        self.inner.clone()
    }

    /// Get the inner item.
    #[inline(always)]
    pub const fn inner(&self) -> &T {
        &self.inner
    }

    /// Returns mutable access to the inner type.
    ///
    /// Caution: Modifying the inner type can cause side-effects on the `seal` hash.
    #[inline(always)]
    #[doc(hidden)]
    pub fn inner_mut(&mut self) -> &mut T {
        &mut self.inner
    }

    /// Get the hash.
    #[inline(always)]
    pub const fn seal(&self) -> B256 {
        self.seal
    }

    /// Get the hash.
    #[inline(always)]
    pub const fn hash(&self) -> B256 {
        self.seal
    }

    /// Get the hash.
    #[inline(always)]
    pub const fn hash_ref(&self) -> &B256 {
        &self.seal
    }

    /// Unseal the inner item, discarding the hash.
    #[inline(always)]
    #[allow(clippy::missing_const_for_fn)] // false positive
    pub fn into_inner(self) -> T {
        self.inner
    }

    /// Unseal the inner item, discarding the hash. Alias for
    /// [`Self::into_inner`].
    #[inline(always)]
    #[allow(clippy::missing_const_for_fn)] // false positive
    pub fn unseal(self) -> T {
        self.into_inner()
    }
}

impl<T> Sealed<&T> {
    /// Maps a `Sealed<&T>` to a `Sealed<T>` by cloning the inner value.
    pub fn cloned(self) -> Sealed<T>
    where
        T: Clone,
    {
        let Self { inner, seal } = self;
        Sealed::new_unchecked(inner.clone(), seal)
    }
}

impl<T> Default for Sealed<T>
where
    T: Sealable + Default,
{
    fn default() -> Self {
        T::default().seal_slow()
    }
}

#[cfg(feature = "arbitrary")]
impl<'a, T> arbitrary::Arbitrary<'a> for Sealed<T>
where
    T: for<'b> arbitrary::Arbitrary<'b> + Sealable,
{
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        Ok(T::arbitrary(u)?.seal_slow())
    }
}

/// Sealeable objects.
pub trait Sealable: Sized {
    /// Calculate the seal hash, this may be slow.
    fn hash_slow(&self) -> B256;

    /// Seal the object by calculating the hash. This may be slow.
    fn seal_slow(self) -> Sealed<Self> {
        Sealed::new(self)
    }

    /// Seal a borrowed object by calculating the hash. This may be slow.
    fn seal_ref_slow(&self) -> Sealed<&Self> {
        Sealed::new_ref(self)
    }

    /// Instantiate an unchecked seal. This should be used with caution.
    fn seal_unchecked(self, seal: B256) -> Sealed<Self> {
        Sealed::new_unchecked(self, seal)
    }

    /// Instantiate an unchecked seal. This should be used with caution.
    fn seal_ref_unchecked(&self, seal: B256) -> Sealed<&Self> {
        Sealed::new_unchecked(self, seal)
    }
}
```
```rs [./src/bytes/serde.rs]
use crate::Bytes;
use alloc::vec::Vec;
use core::fmt;
use serde::de::{self, Visitor};

impl serde::Serialize for Bytes {
    #[inline]
    fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        if serializer.is_human_readable() {
            hex::serialize(self, serializer)
        } else {
            serializer.serialize_bytes(self.as_ref())
        }
    }
}

impl<'de> serde::Deserialize<'de> for Bytes {
    #[inline]
    fn deserialize<D: serde::Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct BytesVisitor;

        impl<'de> Visitor<'de> for BytesVisitor {
            type Value = Bytes;

            fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                formatter.write_str("a variable number of bytes represented as a hex string, an array of u8, or raw bytes")
            }

            fn visit_bytes<E: de::Error>(self, v: &[u8]) -> Result<Self::Value, E> {
                Ok(Bytes::from(v.to_vec()))
            }

            fn visit_byte_buf<E: de::Error>(self, v: Vec<u8>) -> Result<Self::Value, E> {
                Ok(Bytes::from(v))
            }

            fn visit_seq<A: de::SeqAccess<'de>>(self, mut seq: A) -> Result<Self::Value, A::Error> {
                let mut bytes = Vec::with_capacity(seq.size_hint().unwrap_or(0));

                while let Some(byte) = seq.next_element()? {
                    bytes.push(byte);
                }

                Ok(Bytes::from(bytes))
            }

            fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
                hex::decode(v)
                    .map_err(|_| {
                        de::Error::invalid_value(de::Unexpected::Str(v), &"a valid hex string")
                    })
                    .map(From::from)
            }
        }

        if deserializer.is_human_readable() {
            deserializer.deserialize_any(BytesVisitor)
        } else {
            deserializer.deserialize_byte_buf(BytesVisitor)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Deserialize;

    #[derive(Debug, Deserialize)]
    struct TestCase {
        variable: Bytes,
    }

    #[test]
    fn serde() {
        let bytes = Bytes::from_static(&[1, 35, 69, 103, 137, 171, 205, 239]);
        let ser = serde_json::to_string(&bytes).unwrap();
        assert_eq!(ser, "\"0x0123456789abcdef\"");
        assert_eq!(serde_json::from_str::<Bytes>(&ser).unwrap(), bytes);

        let val = serde_json::to_value(&bytes).unwrap();
        assert_eq!(val, serde_json::json! {"0x0123456789abcdef"});
        assert_eq!(serde_json::from_value::<Bytes>(val).unwrap(), bytes);
    }

    #[test]
    fn serde_num_array() {
        let json = serde_json::json! {{"variable": [0,1,2,3,4]}};

        assert_eq!(
            serde_json::from_value::<TestCase>(json).unwrap().variable,
            Bytes::from_static(&[0, 1, 2, 3, 4])
        );
    }

    #[test]
    fn test_bincode_roundtrip() {
        let bytes = Bytes::from_static(&[1, 35, 69, 103, 137, 171, 205, 239]);

        let bin = bincode::serialize(&bytes).unwrap();
        assert_eq!(bincode::deserialize::<Bytes>(&bin).unwrap(), bytes);
    }
}
```
```rs [./src/bytes/rlp.rs]
use super::Bytes;
use alloy_rlp::{Decodable, Encodable};

impl Encodable for Bytes {
    #[inline]
    fn length(&self) -> usize {
        self.0.length()
    }

    #[inline]
    fn encode(&self, out: &mut dyn bytes::BufMut) {
        self.0.encode(out);
    }
}

impl Decodable for Bytes {
    #[inline]
    fn decode(buf: &mut &[u8]) -> Result<Self, alloy_rlp::Error> {
        bytes::Bytes::decode(buf).map(Self)
    }
}
```
```rs [./src/bytes/mod.rs]
use crate::FixedBytes;
use alloc::{boxed::Box, vec::Vec};
use core::{
    borrow::Borrow,
    fmt,
    ops::{Deref, DerefMut, RangeBounds},
};

#[cfg(feature = "rlp")]
mod rlp;

#[cfg(feature = "serde")]
mod serde;

/// Wrapper type around [`bytes::Bytes`] to support "0x" prefixed hex strings.
#[derive(Clone, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Bytes(pub bytes::Bytes);

impl Default for &Bytes {
    #[inline]
    fn default() -> Self {
        static EMPTY: Bytes = Bytes::new();
        &EMPTY
    }
}

impl fmt::Debug for Bytes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::LowerHex::fmt(self, f)
    }
}

impl fmt::Display for Bytes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::LowerHex::fmt(self, f)
    }
}

impl fmt::LowerHex for Bytes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.pad(&hex::encode_prefixed(self.as_ref()))
    }
}

impl fmt::UpperHex for Bytes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.pad(&hex::encode_upper_prefixed(self.as_ref()))
    }
}

impl Deref for Bytes {
    type Target = bytes::Bytes;

    #[inline]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Bytes {
    #[inline]
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl AsRef<[u8]> for Bytes {
    #[inline]
    fn as_ref(&self) -> &[u8] {
        self.0.as_ref()
    }
}

impl Borrow<[u8]> for Bytes {
    #[inline]
    fn borrow(&self) -> &[u8] {
        self.as_ref()
    }
}

impl FromIterator<u8> for Bytes {
    #[inline]
    fn from_iter<T: IntoIterator<Item = u8>>(iter: T) -> Self {
        Self(bytes::Bytes::from_iter(iter))
    }
}

impl<'a> FromIterator<&'a u8> for Bytes {
    #[inline]
    fn from_iter<T: IntoIterator<Item = &'a u8>>(iter: T) -> Self {
        Self(iter.into_iter().copied().collect::<bytes::Bytes>())
    }
}

impl IntoIterator for Bytes {
    type Item = u8;
    type IntoIter = bytes::buf::IntoIter<bytes::Bytes>;

    #[inline]
    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<'a> IntoIterator for &'a Bytes {
    type Item = &'a u8;
    type IntoIter = core::slice::Iter<'a, u8>;

    #[inline]
    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl From<bytes::Bytes> for Bytes {
    #[inline]
    fn from(value: bytes::Bytes) -> Self {
        Self(value)
    }
}

impl From<Bytes> for bytes::Bytes {
    #[inline]
    fn from(value: Bytes) -> Self {
        value.0
    }
}

impl From<Vec<u8>> for Bytes {
    #[inline]
    fn from(value: Vec<u8>) -> Self {
        Self(value.into())
    }
}

impl<const N: usize> From<FixedBytes<N>> for Bytes {
    #[inline]
    fn from(value: FixedBytes<N>) -> Self {
        value.to_vec().into()
    }
}

impl<const N: usize> From<&'static FixedBytes<N>> for Bytes {
    #[inline]
    fn from(value: &'static FixedBytes<N>) -> Self {
        Self::from_static(value.as_slice())
    }
}

impl<const N: usize> From<[u8; N]> for Bytes {
    #[inline]
    fn from(value: [u8; N]) -> Self {
        value.to_vec().into()
    }
}

impl<const N: usize> From<&'static [u8; N]> for Bytes {
    #[inline]
    fn from(value: &'static [u8; N]) -> Self {
        Self::from_static(value)
    }
}

impl From<&'static [u8]> for Bytes {
    #[inline]
    fn from(value: &'static [u8]) -> Self {
        Self::from_static(value)
    }
}

impl From<&'static str> for Bytes {
    #[inline]
    fn from(value: &'static str) -> Self {
        Self::from_static(value.as_bytes())
    }
}

impl From<Box<[u8]>> for Bytes {
    #[inline]
    fn from(value: Box<[u8]>) -> Self {
        Self(value.into())
    }
}

impl From<Bytes> for Vec<u8> {
    #[inline]
    fn from(value: Bytes) -> Self {
        value.0.into()
    }
}

impl PartialEq<[u8]> for Bytes {
    #[inline]
    fn eq(&self, other: &[u8]) -> bool {
        self[..] == *other
    }
}

impl PartialEq<Bytes> for [u8] {
    #[inline]
    fn eq(&self, other: &Bytes) -> bool {
        *self == other[..]
    }
}

impl PartialEq<Vec<u8>> for Bytes {
    #[inline]
    fn eq(&self, other: &Vec<u8>) -> bool {
        self[..] == other[..]
    }
}

impl PartialEq<Bytes> for Vec<u8> {
    #[inline]
    fn eq(&self, other: &Bytes) -> bool {
        *other == *self
    }
}

impl PartialEq<bytes::Bytes> for Bytes {
    #[inline]
    fn eq(&self, other: &bytes::Bytes) -> bool {
        other == self.as_ref()
    }
}

impl core::str::FromStr for Bytes {
    type Err = hex::FromHexError;

    #[inline]
    fn from_str(value: &str) -> Result<Self, Self::Err> {
        hex::decode(value).map(Into::into)
    }
}

impl hex::FromHex for Bytes {
    type Error = hex::FromHexError;

    #[inline]
    fn from_hex<T: AsRef<[u8]>>(hex: T) -> Result<Self, Self::Error> {
        hex::decode(hex).map(Self::from)
    }
}

impl bytes::Buf for Bytes {
    #[inline]
    fn remaining(&self) -> usize {
        self.0.len()
    }

    #[inline]
    fn chunk(&self) -> &[u8] {
        self.0.chunk()
    }

    #[inline]
    fn advance(&mut self, cnt: usize) {
        self.0.advance(cnt)
    }

    #[inline]
    fn copy_to_bytes(&mut self, len: usize) -> bytes::Bytes {
        self.0.copy_to_bytes(len)
    }
}

impl Bytes {
    /// Creates a new empty `Bytes`.
    ///
    /// This will not allocate and the returned `Bytes` handle will be empty.
    ///
    /// # Examples
    ///
    /// ```
    /// use alloy_primitives::Bytes;
    ///
    /// let b = Bytes::new();
    /// assert_eq!(&b[..], b"");
    /// ```
    #[inline]
    pub const fn new() -> Self {
        Self(bytes::Bytes::new())
    }

    /// Creates a new `Bytes` from a static slice.
    ///
    /// The returned `Bytes` will point directly to the static slice. There is
    /// no allocating or copying.
    ///
    /// # Examples
    ///
    /// ```
    /// use alloy_primitives::Bytes;
    ///
    /// let b = Bytes::from_static(b"hello");
    /// assert_eq!(&b[..], b"hello");
    /// ```
    #[inline]
    pub const fn from_static(bytes: &'static [u8]) -> Self {
        Self(bytes::Bytes::from_static(bytes))
    }

    /// Creates a new `Bytes` instance from a slice by copying it.
    #[inline]
    pub fn copy_from_slice(data: &[u8]) -> Self {
        Self(bytes::Bytes::copy_from_slice(data))
    }

    /// Returns a slice of self for the provided range.
    ///
    /// # Panics
    ///
    /// Requires that `begin <= end` and `end <= self.len()`, otherwise slicing
    /// will panic.
    #[inline]
    pub fn slice(&self, range: impl RangeBounds<usize>) -> Self {
        Self(self.0.slice(range))
    }

    /// Returns a slice of self that is equivalent to the given `subset`.
    ///
    /// # Panics
    ///
    /// Requires that the given `subset` slice is in fact contained within the
    /// `Bytes` buffer; otherwise this function will panic.
    #[inline]
    pub fn slice_ref(&self, subset: &[u8]) -> Self {
        Self(self.0.slice_ref(subset))
    }

    /// Splits the bytes into two at the given index.
    ///
    /// # Panics
    ///
    /// Panics if `at > len`.
    #[must_use = "consider Bytes::truncate if you don't need the other half"]
    #[inline]
    pub fn split_off(&mut self, at: usize) -> Self {
        Self(self.0.split_off(at))
    }

    /// Splits the bytes into two at the given index.
    ///
    /// # Panics
    ///
    /// Panics if `at > len`.
    #[must_use = "consider Bytes::advance if you don't need the other half"]
    #[inline]
    pub fn split_to(&mut self, at: usize) -> Self {
        Self(self.0.split_to(at))
    }
}

#[cfg(feature = "arbitrary")]
impl<'a> arbitrary::Arbitrary<'a> for Bytes {
    #[inline]
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        u.arbitrary_iter()?.collect::<arbitrary::Result<Vec<u8>>>().map(Into::into)
    }

    #[inline]
    fn arbitrary_take_rest(u: arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        Ok(Self(u.take_rest().to_vec().into()))
    }

    #[inline]
    fn size_hint(_depth: usize) -> (usize, Option<usize>) {
        (0, None)
    }
}

#[cfg(feature = "arbitrary")]
impl proptest::arbitrary::Arbitrary for Bytes {
    type Parameters = proptest::arbitrary::ParamsFor<Vec<u8>>;
    type Strategy = proptest::arbitrary::Mapped<Vec<u8>, Self>;

    #[inline]
    fn arbitrary() -> Self::Strategy {
        use proptest::strategy::Strategy;
        proptest::arbitrary::any::<Vec<u8>>().prop_map(|vec| Self(vec.into()))
    }

    #[inline]
    fn arbitrary_with(args: Self::Parameters) -> Self::Strategy {
        use proptest::strategy::Strategy;
        proptest::arbitrary::any_with::<Vec<u8>>(args).prop_map(|vec| Self(vec.into()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse() {
        let expected = Bytes::from_static(&[0x12, 0x13, 0xab, 0xcd]);
        assert_eq!("1213abcd".parse::<Bytes>().unwrap(), expected);
        assert_eq!("0x1213abcd".parse::<Bytes>().unwrap(), expected);
        assert_eq!("1213ABCD".parse::<Bytes>().unwrap(), expected);
        assert_eq!("0x1213ABCD".parse::<Bytes>().unwrap(), expected);
    }

    #[test]
    fn format() {
        let b = Bytes::from_static(&[1, 35, 69, 103, 137, 171, 205, 239]);
        assert_eq!(format!("{b}"), "0x0123456789abcdef");
        assert_eq!(format!("{b:x}"), "0x0123456789abcdef");
        assert_eq!(format!("{b:?}"), "0x0123456789abcdef");
        assert_eq!(format!("{b:#?}"), "0x0123456789abcdef");
        assert_eq!(format!("{b:#x}"), "0x0123456789abcdef");
        assert_eq!(format!("{b:X}"), "0x0123456789ABCDEF");
        assert_eq!(format!("{b:#X}"), "0x0123456789ABCDEF");
    }
}
```
```rs [./src/signature/sig.rs]
#![allow(clippy::missing_const_for_fn)] // On purpose for forward compatibility.

use crate::{hex, normalize_v, signature::SignatureError, uint, B256, U256};
use alloc::vec::Vec;
use core::{fmt::Display, str::FromStr};

#[cfg(feature = "k256")]
use crate::Address;

/// The order of the [Secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve.
const SECP256K1N_ORDER: U256 =
    uint!(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141_U256);

/// An Ethereum ECDSA signature.
#[derive(Clone, Copy, Debug, Hash, PartialEq, Eq)]
#[cfg_attr(feature = "diesel", derive(diesel::AsExpression, diesel::FromSqlRow))]
#[cfg_attr(feature = "diesel", diesel(sql_type = diesel::sql_types::Binary))]
pub struct Signature {
    y_parity: bool,
    r: U256,
    s: U256,
}

impl Display for Signature {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "0x{}", hex::encode(self.as_bytes()))
    }
}

impl TryFrom<&[u8]> for Signature {
    type Error = SignatureError;

    /// Parses a 65-byte long raw signature.
    ///
    /// See [`from_raw`](Self::from_raw).
    fn try_from(bytes: &[u8]) -> Result<Self, Self::Error> {
        Self::from_raw(bytes)
    }
}

impl FromStr for Signature {
    type Err = SignatureError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::from_raw_array(&hex::decode_to_array(s)?)
    }
}

impl From<&Signature> for [u8; 65] {
    #[inline]
    fn from(value: &Signature) -> [u8; 65] {
        value.as_bytes()
    }
}

impl From<Signature> for [u8; 65] {
    #[inline]
    fn from(value: Signature) -> [u8; 65] {
        value.as_bytes()
    }
}

impl From<&Signature> for Vec<u8> {
    #[inline]
    fn from(value: &Signature) -> Self {
        value.as_bytes().to_vec()
    }
}

impl From<Signature> for Vec<u8> {
    #[inline]
    fn from(value: Signature) -> Self {
        value.as_bytes().to_vec()
    }
}

#[cfg(feature = "k256")]
impl From<(k256::ecdsa::Signature, k256::ecdsa::RecoveryId)> for Signature {
    fn from(value: (k256::ecdsa::Signature, k256::ecdsa::RecoveryId)) -> Self {
        Self::from_signature_and_parity(value.0, value.1.is_y_odd())
    }
}

#[cfg(feature = "k256")]
impl TryFrom<Signature> for k256::ecdsa::Signature {
    type Error = k256::ecdsa::Error;

    fn try_from(value: Signature) -> Result<Self, Self::Error> {
        value.to_k256()
    }
}

#[cfg(feature = "rlp")]
impl Signature {
    /// Decode an RLP-encoded VRS signature. Accepts `decode_parity` closure which allows to
    /// customize parity decoding and possibly extract additional data from it (e.g chain_id for
    /// legacy signature).
    pub fn decode_rlp_vrs(
        buf: &mut &[u8],
        decode_parity: impl FnOnce(&mut &[u8]) -> alloy_rlp::Result<bool>,
    ) -> Result<Self, alloy_rlp::Error> {
        use alloy_rlp::Decodable;

        let parity = decode_parity(buf)?;
        let r = Decodable::decode(buf)?;
        let s = Decodable::decode(buf)?;

        Ok(Self::new(r, s, parity))
    }
}

impl Signature {
    /// Instantiate a new signature from `r`, `s`, and `v` values.
    #[inline]
    pub const fn new(r: U256, s: U256, y_parity: bool) -> Self {
        Self { r, s, y_parity }
    }

    /// Parses a 65-byte long raw signature.
    ///
    /// The first 32 bytes is the `r` value, the second 32 bytes the `s` value, and the final byte
    /// is the `v` value in 'Electrum' notation.
    #[inline]
    pub fn from_raw(bytes: &[u8]) -> Result<Self, SignatureError> {
        Self::from_raw_array(
            bytes.try_into().map_err(|_| SignatureError::FromBytes("expected exactly 65 bytes"))?,
        )
    }

    /// Parses a 65-byte long raw signature.
    ///
    /// See [`from_raw`](Self::from_raw).
    #[inline]
    pub fn from_raw_array(bytes: &[u8; 65]) -> Result<Self, SignatureError> {
        let [bytes @ .., v] = bytes;
        let v = *v as u64;
        let Some(parity) = normalize_v(v) else { return Err(SignatureError::InvalidParity(v)) };
        Ok(Self::from_bytes_and_parity(bytes, parity))
    }

    /// Parses a signature from a byte slice, with a v value
    ///
    /// # Panics
    ///
    /// If the slice is not at least 64 bytes long.
    #[inline]
    #[track_caller]
    pub fn from_bytes_and_parity(bytes: &[u8], parity: bool) -> Self {
        let (r_bytes, s_bytes) = bytes[..64].split_at(32);
        let r = U256::from_be_slice(r_bytes);
        let s = U256::from_be_slice(s_bytes);
        Self::new(r, s, parity)
    }

    /// Returns the byte-array representation of this signature.
    ///
    /// The first 32 bytes are the `r` value, the second 32 bytes the `s` value
    /// and the final byte is the `v` value in 'Electrum' notation.
    #[inline]
    pub fn as_bytes(&self) -> [u8; 65] {
        let mut sig = [0u8; 65];
        sig[..32].copy_from_slice(&self.r.to_be_bytes::<32>());
        sig[32..64].copy_from_slice(&self.s.to_be_bytes::<32>());
        sig[64] = 27 + self.y_parity as u8;
        sig
    }

    /// Decode the signature from the ERC-2098 compact representation.
    ///
    /// The first 32 bytes are the `r` value, and the next 32 bytes are the `s` value with `yParity`
    /// in the top bit of the `s` value, as described in ERC-2098.
    ///
    /// See <https://eips.ethereum.org/EIPS/eip-2098>
    ///
    /// # Panics
    ///
    /// If the slice is not at least 64 bytes long.
    pub fn from_erc2098(bytes: &[u8]) -> Self {
        let (r_bytes, y_and_s_bytes) = bytes[..64].split_at(32);
        let r = U256::from_be_slice(r_bytes);
        let y_and_s = U256::from_be_slice(y_and_s_bytes);
        let y_parity = y_and_s.bit(255);
        let mut s = y_and_s;
        s.set_bit(255, false);
        Self { y_parity, r, s }
    }

    /// Returns the ERC-2098 compact representation of this signature.
    ///
    /// The first 32 bytes are the `r` value, and the next 32 bytes are the `s` value with `yParity`
    /// in the top bit of the `s` value, as described in ERC-2098.
    ///
    /// See <https://eips.ethereum.org/EIPS/eip-2098>
    pub fn as_erc2098(&self) -> [u8; 64] {
        let normalized = self.normalized_s();
        // The top bit of the `s` parameters is always 0, due to the use of canonical
        // signatures which flip the solution parity to prevent negative values, which was
        // introduced as a constraint in Homestead.
        let mut sig = [0u8; 64];
        sig[..32].copy_from_slice(&normalized.r().to_be_bytes::<32>());
        sig[32..64].copy_from_slice(&normalized.s().to_be_bytes::<32>());
        debug_assert_eq!(sig[32] >> 7, 0, "top bit of s should be 0");
        sig[32] |= (normalized.y_parity as u8) << 7;
        sig
    }

    /// Sets the recovery ID by normalizing a `v` value.
    #[inline]
    pub fn with_parity(mut self, v: bool) -> Self {
        self.y_parity = v;
        self
    }

    /// Returns the inner ECDSA signature.
    #[cfg(feature = "k256")]
    #[deprecated(note = "use `Signature::to_k256` instead")]
    #[inline]
    pub fn into_inner(self) -> k256::ecdsa::Signature {
        self.try_into().expect("signature conversion failed")
    }

    /// Returns the inner ECDSA signature.
    #[cfg(feature = "k256")]
    #[inline]
    pub fn to_k256(self) -> Result<k256::ecdsa::Signature, k256::ecdsa::Error> {
        k256::ecdsa::Signature::from_scalars(self.r.to_be_bytes(), self.s.to_be_bytes())
    }

    /// Instantiate from a signature and recovery id
    #[cfg(feature = "k256")]
    pub fn from_signature_and_parity(sig: k256::ecdsa::Signature, v: bool) -> Self {
        let r = U256::from_be_slice(sig.r().to_bytes().as_ref());
        let s = U256::from_be_slice(sig.s().to_bytes().as_ref());
        Self { y_parity: v, r, s }
    }

    /// Creates a [`Signature`] from the serialized `r` and `s` scalar values, which
    /// comprise the ECDSA signature, alongside a `v` value, used to determine the recovery ID.
    #[inline]
    pub fn from_scalars_and_parity(r: B256, s: B256, parity: bool) -> Self {
        Self::new(U256::from_be_bytes(r.0), U256::from_be_bytes(s.0), parity)
    }

    /// Normalizes the signature into "low S" form as described in
    /// [BIP 0062: Dealing with Malleability][1].
    ///
    /// If `s` is already normalized, returns `None`.
    ///
    /// [1]: https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki
    #[inline]
    pub fn normalize_s(&self) -> Option<Self> {
        let s = self.s();
        if s > SECP256K1N_ORDER >> 1 {
            Some(Self { y_parity: !self.y_parity, r: self.r, s: SECP256K1N_ORDER - s })
        } else {
            None
        }
    }

    /// Normalizes the signature into "low S" form as described in
    /// [BIP 0062: Dealing with Malleability][1].
    ///
    /// If `s` is already normalized, returns `self`.
    ///
    /// [1]: https://github.com/bitcoin/bips/blob/master/bip-0062.mediawiki
    #[inline]
    pub fn normalized_s(self) -> Self {
        self.normalize_s().unwrap_or(self)
    }

    /// Returns the recovery ID.
    #[cfg(feature = "k256")]
    #[inline]
    pub fn recid(&self) -> k256::ecdsa::RecoveryId {
        k256::ecdsa::RecoveryId::new(self.y_parity, false)
    }

    #[cfg(feature = "k256")]
    #[doc(hidden)]
    #[deprecated(note = "use `Signature::recid` instead")]
    pub fn recovery_id(&self) -> k256::ecdsa::RecoveryId {
        self.recid()
    }

    /// Recovers an [`Address`] from this signature and the given message by first prefixing and
    /// hashing the message according to [EIP-191](crate::eip191_hash_message).
    #[cfg(feature = "k256")]
    #[inline]
    pub fn recover_address_from_msg<T: AsRef<[u8]>>(
        &self,
        msg: T,
    ) -> Result<Address, SignatureError> {
        self.recover_from_msg(msg).map(|vk| Address::from_public_key(&vk))
    }

    /// Recovers an [`Address`] from this signature and the given prehashed message.
    #[cfg(feature = "k256")]
    #[inline]
    pub fn recover_address_from_prehash(&self, prehash: &B256) -> Result<Address, SignatureError> {
        self.recover_from_prehash(prehash).map(|vk| Address::from_public_key(&vk))
    }

    /// Recovers a [`VerifyingKey`] from this signature and the given message by first prefixing and
    /// hashing the message according to [EIP-191](crate::eip191_hash_message).
    ///
    /// [`VerifyingKey`]: k256::ecdsa::VerifyingKey
    #[cfg(feature = "k256")]
    #[inline]
    pub fn recover_from_msg<T: AsRef<[u8]>>(
        &self,
        msg: T,
    ) -> Result<k256::ecdsa::VerifyingKey, SignatureError> {
        self.recover_from_prehash(&crate::eip191_hash_message(msg))
    }

    /// Recovers a [`VerifyingKey`] from this signature and the given prehashed message.
    ///
    /// [`VerifyingKey`]: k256::ecdsa::VerifyingKey
    #[cfg(feature = "k256")]
    #[inline]
    pub fn recover_from_prehash(
        &self,
        prehash: &B256,
    ) -> Result<k256::ecdsa::VerifyingKey, SignatureError> {
        let this = self.normalized_s();
        k256::ecdsa::VerifyingKey::recover_from_prehash(
            prehash.as_slice(),
            &this.to_k256()?,
            this.recid(),
        )
        .map_err(Into::into)
    }

    /// Returns the `r` component of this signature.
    #[inline]
    pub fn r(&self) -> U256 {
        self.r
    }

    /// Returns the `s` component of this signature.
    #[inline]
    pub fn s(&self) -> U256 {
        self.s
    }

    /// Returns the recovery ID as a `bool`.
    #[inline]
    pub fn v(&self) -> bool {
        self.y_parity
    }

    /// Length of RLP RS field encoding
    #[cfg(feature = "rlp")]
    pub fn rlp_rs_len(&self) -> usize {
        alloy_rlp::Encodable::length(&self.r) + alloy_rlp::Encodable::length(&self.s)
    }

    /// Write R and S to an RLP buffer in progress.
    #[cfg(feature = "rlp")]
    pub fn write_rlp_rs(&self, out: &mut dyn alloy_rlp::BufMut) {
        alloy_rlp::Encodable::encode(&self.r, out);
        alloy_rlp::Encodable::encode(&self.s, out);
    }

    /// Write the VRS to the output.
    #[cfg(feature = "rlp")]
    pub fn write_rlp_vrs(&self, out: &mut dyn alloy_rlp::BufMut, v: impl alloy_rlp::Encodable) {
        v.encode(out);
        self.write_rlp_rs(out);
    }

    #[doc(hidden)]
    #[inline(always)]
    pub fn test_signature() -> Self {
        Self::from_scalars_and_parity(
            b256!("0x840cfc572845f5786e702984c2a582528cad4b49b2a10b9db1be7fca90058565"),
            b256!("0x25e7109ceb98168d95b09b18bbf6b685130e0562f233877d492b94eee0c5b6d1"),
            false,
        )
    }
}

#[cfg(feature = "arbitrary")]
impl<'a> arbitrary::Arbitrary<'a> for Signature {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        Ok(Self::new(u.arbitrary()?, u.arbitrary()?, u.arbitrary()?))
    }
}

#[cfg(feature = "arbitrary")]
impl proptest::arbitrary::Arbitrary for Signature {
    type Parameters = ();
    type Strategy = proptest::strategy::Map<
        <(U256, U256, bool) as proptest::arbitrary::Arbitrary>::Strategy,
        fn((U256, U256, bool)) -> Self,
    >;

    fn arbitrary_with((): Self::Parameters) -> Self::Strategy {
        use proptest::strategy::Strategy;
        proptest::arbitrary::any::<(U256, U256, bool)>()
            .prop_map(|(r, s, y_parity)| Self::new(r, s, y_parity))
    }
}

#[cfg(feature = "serde")]
mod signature_serde {
    use super::Signature;
    use crate::{normalize_v, U256, U64};
    use serde::{Deserialize, Deserializer, Serialize};

    #[derive(Serialize, Deserialize)]
    struct HumanReadableRepr {
        r: U256,
        s: U256,
        #[serde(rename = "yParity")]
        y_parity: Option<U64>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        v: Option<U64>,
    }

    type NonHumanReadableRepr = (U256, U256, U64);

    impl Serialize for Signature {
        fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::Serializer,
        {
            // if the serializer is human readable, serialize as a map, otherwise as a tuple
            if serializer.is_human_readable() {
                HumanReadableRepr {
                    y_parity: Some(U64::from(self.y_parity as u64)),
                    v: Some(U64::from(self.y_parity as u64)),
                    r: self.r,
                    s: self.s,
                }
                .serialize(serializer)
            } else {
                let repr: NonHumanReadableRepr = (self.r, self.s, U64::from(self.y_parity as u64));
                repr.serialize(serializer)
            }
        }
    }

    impl<'de> Deserialize<'de> for Signature {
        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where
            D: Deserializer<'de>,
        {
            let (y_parity, v, r, s) = if deserializer.is_human_readable() {
                let HumanReadableRepr { y_parity, v, r, s } = <_>::deserialize(deserializer)?;
                (y_parity, v, r, s)
            } else {
                let (r, s, y_parity) = NonHumanReadableRepr::deserialize(deserializer)?;
                (Some(y_parity), None, r, s)
            };

            // Attempt to extract `y_parity` bit from either `yParity` key or `v` value.
            let y_parity = if let Some(y_parity) = y_parity {
                match y_parity.to::<u64>() {
                    0 => false,
                    1 => true,
                    _ => return Err(serde::de::Error::custom("invalid yParity")),
                }
            } else if let Some(v) = v {
                normalize_v(v.to()).ok_or(serde::de::Error::custom("invalid v"))?
            } else {
                return Err(serde::de::Error::custom("missing `yParity` or `v`"));
            };

            Ok(Self::new(r, s, y_parity))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use core::str::FromStr;

    #[cfg(feature = "rlp")]
    use alloy_rlp::{Decodable, Encodable};

    #[test]
    #[cfg(feature = "k256")]
    fn can_recover_tx_sender_not_normalized() {
        let sig = Signature::from_str("48b55bfa915ac795c431978d8a6a992b628d557da5ff759b307d495a36649353efffd310ac743f371de3b9f7f9cb56c0b28ad43601b4ab949f53faa07bd2c8041b").unwrap();
        let hash = b256!("0x5eb4f5a33c621f32a8622d5f943b6b102994dfe4e5aebbefe69bb1b2aa0fc93e");
        let expected = address!("0x0f65fe9276bc9a24ae7083ae28e2660ef72df99e");
        assert_eq!(sig.recover_address_from_prehash(&hash).unwrap(), expected);
    }

    #[test]
    #[cfg(feature = "k256")]
    fn recover_web3_signature() {
        // test vector taken from:
        // https://web3js.readthedocs.io/en/v1.2.2/web3-eth-accounts.html#sign
        let sig = Signature::from_str(
            "b91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c"
        ).expect("could not parse signature");
        let expected = address!("0x2c7536E3605D9C16a7a3D7b1898e529396a65c23");
        assert_eq!(sig.recover_address_from_msg("Some data").unwrap(), expected);
    }

    #[test]
    fn signature_from_str() {
        let s1 = Signature::from_str(
            "0xaa231fbe0ed2b5418e6ba7c19bee2522852955ec50996c02a2fe3e71d30ddaf1645baf4823fea7cb4fcc7150842493847cfb6a6d63ab93e8ee928ee3f61f503500"
        ).expect("could not parse 0x-prefixed signature");

        let s2 = Signature::from_str(
            "aa231fbe0ed2b5418e6ba7c19bee2522852955ec50996c02a2fe3e71d30ddaf1645baf4823fea7cb4fcc7150842493847cfb6a6d63ab93e8ee928ee3f61f503500"
        ).expect("could not parse non-prefixed signature");

        assert_eq!(s1, s2);
    }

    #[cfg(feature = "serde")]
    #[test]
    fn deserialize_with_parity() {
        let raw_signature_with_y_parity = serde_json::json!({
            "r": "0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0",
            "s": "0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05",
            "v": "0x1",
            "yParity": "0x1"
        });

        let signature: Signature = serde_json::from_value(raw_signature_with_y_parity).unwrap();

        let expected = Signature::new(
            U256::from_str("0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0")
                .unwrap(),
            U256::from_str("0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05")
                .unwrap(),
            true,
        );

        assert_eq!(signature, expected);
    }

    #[cfg(feature = "serde")]
    #[test]
    fn serialize_both_parity() {
        // this test should be removed if the struct moves to an enum based on tx type
        let signature = Signature::new(
            U256::from_str("0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0")
                .unwrap(),
            U256::from_str("0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05")
                .unwrap(),
            true,
        );

        let serialized = serde_json::to_string(&signature).unwrap();
        assert_eq!(
            serialized,
            r#"{"r":"0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0","s":"0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05","yParity":"0x1","v":"0x1"}"#
        );
    }

    #[cfg(feature = "serde")]
    #[test]
    fn serialize_v_only() {
        // this test should be removed if the struct moves to an enum based on tx type
        let signature = Signature::new(
            U256::from_str("0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0")
                .unwrap(),
            U256::from_str("0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05")
                .unwrap(),
            true,
        );

        let expected = r#"{"r":"0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0","s":"0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05","yParity":"0x1","v":"0x1"}"#;

        let serialized = serde_json::to_string(&signature).unwrap();
        assert_eq!(serialized, expected);
    }

    #[cfg(feature = "serde")]
    #[test]
    fn bincode_roundtrip() {
        let signature = Signature::new(
            U256::from_str("0xc569c92f176a3be1a6352dd5005bfc751dcb32f57623dd2a23693e64bf4447b0")
                .unwrap(),
            U256::from_str("0x1a891b566d369e79b7a66eecab1e008831e22daa15f91a0a0cf4f9f28f47ee05")
                .unwrap(),
            true,
        );

        let bin = bincode::serialize(&signature).unwrap();
        assert_eq!(bincode::deserialize::<Signature>(&bin).unwrap(), signature);
    }

    #[cfg(feature = "rlp")]
    #[test]
    fn signature_rlp_encode() {
        // Given a Signature instance
        let sig = Signature::from_str("48b55bfa915ac795c431978d8a6a992b628d557da5ff759b307d495a36649353efffd310ac743f371de3b9f7f9cb56c0b28ad43601b4ab949f53faa07bd2c8041b").unwrap();

        // Initialize an empty buffer
        let mut buf = vec![];

        // Encode the Signature into the buffer
        sig.write_rlp_vrs(&mut buf, sig.v());

        // Define the expected hex-encoded string
        let expected = "80a048b55bfa915ac795c431978d8a6a992b628d557da5ff759b307d495a36649353a0efffd310ac743f371de3b9f7f9cb56c0b28ad43601b4ab949f53faa07bd2c804";

        // Assert that the encoded buffer matches the expected hex-encoded string
        assert_eq!(hex::encode(&buf), expected);
    }

    #[cfg(feature = "rlp")]
    #[test]
    fn signature_rlp_length() {
        // Given a Signature instance
        let sig = Signature::from_str("48b55bfa915ac795c431978d8a6a992b628d557da5ff759b307d495a36649353efffd310ac743f371de3b9f7f9cb56c0b28ad43601b4ab949f53faa07bd2c8041b").unwrap();

        // Assert that the length of the Signature matches the expected length
        assert_eq!(sig.rlp_rs_len() + sig.v().length(), 67);
    }

    #[cfg(feature = "rlp")]
    #[test]
    fn rlp_vrs_len() {
        let signature = Signature::test_signature();
        assert_eq!(67, signature.rlp_rs_len() + 1);
    }

    #[cfg(feature = "rlp")]
    #[test]
    fn encode_and_decode() {
        let signature = Signature::test_signature();

        let mut encoded = Vec::new();
        signature.write_rlp_vrs(&mut encoded, signature.v());
        assert_eq!(encoded.len(), signature.rlp_rs_len() + signature.v().length());
        let decoded = Signature::decode_rlp_vrs(&mut &*encoded, bool::decode).unwrap();
        assert_eq!(signature, decoded);
    }

    #[test]
    fn as_bytes() {
        let signature = Signature::new(
            U256::from_str(
                "18515461264373351373200002665853028612451056578545711640558177340181847433846",
            )
            .unwrap(),
            U256::from_str(
                "46948507304638947509940763649030358759909902576025900602547168820602576006531",
            )
            .unwrap(),
            false,
        );

        let expected = hex!("0x28ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa63627667cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d831b");
        assert_eq!(signature.as_bytes(), expected);
    }

    #[test]
    fn as_erc2098_y_false() {
        let signature = Signature::new(
            U256::from_str(
                "47323457007453657207889730243826965761922296599680473886588287015755652701072",
            )
            .unwrap(),
            U256::from_str(
                "57228803202727131502949358313456071280488184270258293674242124340113824882788",
            )
            .unwrap(),
            false,
        );

        let expected = hex!("0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b907e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064");
        assert_eq!(signature.as_erc2098(), expected);
    }

    #[test]
    fn as_erc2098_y_true() {
        let signature = Signature::new(
            U256::from_str("0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76")
                .unwrap(),
            U256::from_str("0x139c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793")
                .unwrap(),
            true,
        );

        let expected = hex!("0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76939c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793");
        assert_eq!(signature.as_erc2098(), expected);
    }

    #[test]
    fn from_erc2098_y_false() {
        let expected = Signature::new(
            U256::from_str(
                "47323457007453657207889730243826965761922296599680473886588287015755652701072",
            )
            .unwrap(),
            U256::from_str(
                "57228803202727131502949358313456071280488184270258293674242124340113824882788",
            )
            .unwrap(),
            false,
        );

        assert_eq!(
            Signature::from_erc2098(
                &hex!("0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b907e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064")
            ),
            expected
        );
    }

    #[test]
    fn from_erc2098_y_true() {
        let expected = Signature::new(
            U256::from_str("0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76")
                .unwrap(),
            U256::from_str("0x139c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793")
                .unwrap(),
            true,
        );

        assert_eq!(
            Signature::from_erc2098(
                &hex!("0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76939c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793")
            ),
            expected
        );
    }

    #[test]
    fn display_impl() {
        let sig = Signature::new(
            U256::from_str("0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76")
                .unwrap(),
            U256::from_str("0x139c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f550793")
                .unwrap(),
            true,
        );

        assert_eq!(
            format!("{sig}"),
            "0x9328da16089fcba9bececa81663203989f2df5fe1faa6291a45381c81bd17f76139c6d6b623b42da56557e5e734a43dc83345ddfadec52cbe24d0cc64f5507931c"
        );
    }
}
```
```rs [./src/signature/error.rs]
use core::{convert::Infallible, fmt};

/// Errors in signature parsing or verification.
#[derive(Debug)]
#[cfg_attr(not(feature = "k256"), derive(Copy, Clone))]
pub enum SignatureError {
    /// Error converting from bytes.
    FromBytes(&'static str),

    /// Error converting hex to bytes.
    FromHex(hex::FromHexError),

    /// Invalid parity.
    InvalidParity(u64),

    /// k256 error
    #[cfg(feature = "k256")]
    K256(k256::ecdsa::Error),
}

#[cfg(feature = "k256")]
impl From<k256::ecdsa::Error> for SignatureError {
    fn from(err: k256::ecdsa::Error) -> Self {
        Self::K256(err)
    }
}

impl From<hex::FromHexError> for SignatureError {
    fn from(err: hex::FromHexError) -> Self {
        Self::FromHex(err)
    }
}

impl core::error::Error for SignatureError {
    fn source(&self) -> Option<&(dyn core::error::Error + 'static)> {
        match self {
            #[cfg(all(feature = "k256", feature = "std"))]
            Self::K256(e) => Some(e),
            #[cfg(any(feature = "std", not(feature = "hex-compat")))]
            Self::FromHex(e) => Some(e),
            _ => None,
        }
    }
}

impl fmt::Display for SignatureError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            #[cfg(feature = "k256")]
            Self::K256(e) => e.fmt(f),
            Self::FromBytes(e) => f.write_str(e),
            Self::FromHex(e) => e.fmt(f),
            Self::InvalidParity(v) => write!(f, "invalid parity: {v}"),
        }
    }
}

impl From<Infallible> for SignatureError {
    fn from(_: Infallible) -> Self {
        unreachable!()
    }
}
```
```rs [./src/signature/mod.rs]
mod error;
pub use error::SignatureError;

mod utils;
pub use utils::{normalize_v, to_eip155_v};

mod sig;
pub use sig::Signature;

/// Deprecated alias for [`Signature`].
#[deprecated(since = "0.9.0", note = "use Signature instead")]
pub type PrimitiveSignature = Signature;
```
```rs [./src/signature/utils.rs]
use crate::ChainId;

/// Applies [EIP-155](https://eips.ethereum.org/EIPS/eip-155).
#[inline]
pub const fn to_eip155_v(v: u8, chain_id: ChainId) -> ChainId {
    (v as u64) + 35 + chain_id * 2
}

/// Attempts to normalize the v value to a boolean parity value.
///
/// Returns `None` if the value is invalid for any of the known Ethereum parity encodings.
#[inline]
pub const fn normalize_v(v: u64) -> Option<bool> {
    if !is_valid_v(v) {
        return None;
    }

    // Simplifying:
    //  0| 1 => v % 2 == 0
    // 27|28 => (v - 27) % 2 == 0
    //  35.. => (v - 35) % 2 == 0
    // ---
    //  0| 1 => v % 2 == 0
    // 27|28 => v % 2 == 1
    //  35.. => v % 2 == 1
    // ---
    //   ..2 => v % 2 == 0
    //     _ => v % 2 == 1
    let cmp = (v <= 1) as u64;
    Some(v % 2 == cmp)
}

/// Returns `true` if the given `v` value is valid for any of the known Ethereum parity encodings.
#[inline]
const fn is_valid_v(v: u64) -> bool {
    matches!(
        v,
        // Case 1: raw/bare
        0 | 1
        // Case 2: non-EIP-155 v value
        | 27 | 28
        // Case 3: EIP-155 V value
        | 35..
    )
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn normalizes_v() {
        assert_eq!(normalize_v(0), Some(false));
        assert_eq!(normalize_v(1), Some(true));

        for invalid_v in 2..27 {
            assert_eq!(normalize_v(invalid_v), None);
        }

        assert_eq!(normalize_v(27), Some(false));
        assert_eq!(normalize_v(28), Some(true));

        for invalid_v in 29..35 {
            assert_eq!(normalize_v(invalid_v), None);
        }

        assert_eq!(normalize_v(35), Some(false));
        assert_eq!(normalize_v(36), Some(true));
        for v in 35..100 {
            assert_eq!(normalize_v(v), Some((v - 35) % 2 != 0));
        }
    }
}
```
```rs [./src/lib.rs]
#![doc = include_str!("../README.md")]
#![doc(
    html_logo_url = "https://raw.githubusercontent.com/alloy-rs/core/main/assets/alloy.jpg",
    html_favicon_url = "https://raw.githubusercontent.com/alloy-rs/core/main/assets/favicon.ico"
)]
#![cfg_attr(not(test), warn(unused_crate_dependencies))]
#![cfg_attr(not(feature = "std"), no_std)]
#![cfg_attr(feature = "nightly", feature(hasher_prefixfree_extras))]
#![cfg_attr(docsrs, feature(doc_cfg, doc_auto_cfg))]

#[macro_use]
extern crate alloc;

use paste as _;
#[cfg(feature = "sha3-keccak")]
use sha3 as _;
use tiny_keccak as _;

#[cfg(feature = "postgres")]
pub mod postgres;

#[cfg(feature = "diesel")]
pub mod diesel;

pub mod aliases;
#[doc(no_inline)]
pub use aliases::{
    BlockHash, BlockNumber, BlockTimestamp, ChainId, Selector, StorageKey, StorageValue, TxHash,
    TxIndex, TxNonce, TxNumber, B128, B256, B512, B64, I128, I16, I160, I256, I32, I64, I8, U128,
    U16, U160, U256, U32, U512, U64, U8,
};

#[macro_use]
mod bits;
pub use bits::{
    Address, AddressChecksumBuffer, AddressError, Bloom, BloomInput, FixedBytes, Function,
    BLOOM_BITS_PER_ITEM, BLOOM_SIZE_BITS, BLOOM_SIZE_BYTES,
};

#[path = "bytes/mod.rs"]
mod bytes_;
pub use self::bytes_::Bytes;

mod common;
pub use common::TxKind;

mod log;
pub use log::{logs_bloom, IntoLogData, Log, LogData};

#[cfg(feature = "map")]
pub mod map;

mod sealed;
pub use sealed::{Sealable, Sealed};

mod signed;
pub use signed::{BigIntConversionError, ParseSignedError, Sign, Signed};

mod signature;
#[allow(deprecated)]
pub use signature::PrimitiveSignature;
pub use signature::{normalize_v, to_eip155_v, Signature, SignatureError};

pub mod utils;
pub use utils::{eip191_hash_message, keccak256, Keccak256, KECCAK256_EMPTY};

#[doc(hidden)] // Use `hex` directly instead!
pub mod hex_literal;

#[doc(no_inline)]
pub use {
    ::bytes,
    ::hex,
    ruint::{self, uint, Uint},
};

#[cfg(feature = "serde")]
#[doc(no_inline)]
pub use ::hex::serde as serde_hex;

/// 20-byte [fixed byte-array][FixedBytes] type.
///
/// You'll likely want to use [`Address`] instead, as it is a different type
/// from `FixedBytes<20>`, and implements methods useful for working with
/// Ethereum addresses.
///
/// If you are sure you want to use this type, and you don't want the
/// deprecation warning, you can use `aliases::B160`.
#[deprecated(
    since = "0.3.2",
    note = "you likely want to use `Address` instead. \
            `B160` and `Address` are different types, \
            see this type's documentation for more."
)]
pub type B160 = FixedBytes<20>;

// Not public API.
#[doc(hidden)]
pub mod private {
    pub use alloc::vec::Vec;
    pub use core::{
        self,
        borrow::{Borrow, BorrowMut},
        cmp::Ordering,
        prelude::rust_2021::*,
    };
    pub use derive_more;

    #[cfg(feature = "getrandom")]
    pub use getrandom;

    #[cfg(feature = "rand")]
    pub use rand;

    #[cfg(feature = "rlp")]
    pub use alloy_rlp;

    #[cfg(feature = "allocative")]
    pub use allocative;

    #[cfg(feature = "serde")]
    pub use serde;

    #[cfg(feature = "arbitrary")]
    pub use {arbitrary, derive_arbitrary, proptest, proptest_derive};

    #[cfg(feature = "diesel")]
    pub use diesel;
}
```
```rs [./src/utils/units.rs]
use crate::{ParseSignedError, I256, U256};
use alloc::string::{String, ToString};
use core::fmt;

const MAX_U64_EXPONENT: u8 = 19;

/// Converts the input to a U256 and converts from Ether to Wei.
///
/// # Examples
///
/// ```
/// use alloy_primitives::{
///     utils::{parse_ether, Unit},
///     U256,
/// };
///
/// let eth = Unit::ETHER.wei();
/// assert_eq!(parse_ether("1").unwrap(), eth);
/// ```
pub fn parse_ether(eth: &str) -> Result<U256, UnitsError> {
    ParseUnits::parse_units(eth, Unit::ETHER).map(Into::into)
}

/// Parses a decimal number and multiplies it with 10^units.
///
/// # Examples
///
/// ```
/// use alloy_primitives::{utils::parse_units, U256};
///
/// let amount_in_eth = U256::from_str_radix("15230001000000000000", 10).unwrap();
/// let amount_in_gwei = U256::from_str_radix("15230001000", 10).unwrap();
/// let amount_in_wei = U256::from_str_radix("15230001000", 10).unwrap();
/// assert_eq!(amount_in_eth, parse_units("15.230001000000000000", "ether").unwrap().into());
/// assert_eq!(amount_in_gwei, parse_units("15.230001000000000000", "gwei").unwrap().into());
/// assert_eq!(amount_in_wei, parse_units("15230001000", "wei").unwrap().into());
/// ```
///
/// Example of trying to parse decimal WEI, which should fail, as WEI is the smallest
/// ETH denominator. 1 ETH = 10^18 WEI.
///
/// ```should_panic
/// use alloy_primitives::{utils::parse_units, U256};
/// let amount_in_wei = U256::from_str_radix("15230001000", 10).unwrap();
/// assert_eq!(amount_in_wei, parse_units("15.230001000000000000", "wei").unwrap().into());
/// ```
pub fn parse_units<K, E>(amount: &str, units: K) -> Result<ParseUnits, UnitsError>
where
    K: TryInto<Unit, Error = E>,
    UnitsError: From<E>,
{
    ParseUnits::parse_units(amount, units.try_into()?)
}

/// Formats the given number of Wei as an Ether amount.
///
/// # Examples
///
/// ```
/// use alloy_primitives::{utils::format_ether, U256};
///
/// let eth = format_ether(1395633240123456000_u128);
/// assert_eq!(format_ether(1395633240123456000_u128), "1.395633240123456000");
/// ```
pub fn format_ether<T: Into<ParseUnits>>(amount: T) -> String {
    amount.into().format_units(Unit::ETHER)
}

/// Formats the given number of Wei as the given unit.
///
/// # Examples
///
/// ```
/// use alloy_primitives::{utils::format_units, U256};
///
/// let eth = U256::from_str_radix("1395633240123456000", 10).unwrap();
/// assert_eq!(format_units(eth, "eth").unwrap(), "1.395633240123456000");
///
/// assert_eq!(format_units(i64::MIN, "gwei").unwrap(), "-9223372036.854775808");
///
/// assert_eq!(format_units(i128::MIN, 36).unwrap(), "-170.141183460469231731687303715884105728");
/// ```
pub fn format_units<T, K, E>(amount: T, units: K) -> Result<String, UnitsError>
where
    T: Into<ParseUnits>,
    K: TryInto<Unit, Error = E>,
    UnitsError: From<E>,
{
    units.try_into().map(|units| amount.into().format_units(units)).map_err(UnitsError::from)
}

/// Error type for [`Unit`]-related operations.
#[derive(Debug)]
pub enum UnitsError {
    /// The provided units are not recognized.
    InvalidUnit(String),
    /// Overflow when parsing a signed number.
    ParseSigned(ParseSignedError),
}

impl core::error::Error for UnitsError {
    fn source(&self) -> Option<&(dyn core::error::Error + 'static)> {
        match self {
            Self::InvalidUnit(_) => None,
            Self::ParseSigned(e) => Some(e),
        }
    }
}

impl fmt::Display for UnitsError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidUnit(s) => write!(f, "{s:?} is not a valid unit"),
            Self::ParseSigned(e) => e.fmt(f),
        }
    }
}

impl From<ruint::ParseError> for UnitsError {
    fn from(value: ruint::ParseError) -> Self {
        Self::ParseSigned(value.into())
    }
}

impl From<ParseSignedError> for UnitsError {
    fn from(value: ParseSignedError) -> Self {
        Self::ParseSigned(value)
    }
}

/// This enum holds the numeric types that a possible to be returned by `parse_units` and
/// that are taken by `format_units`.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub enum ParseUnits {
    /// Unsigned 256-bit integer.
    U256(U256),
    /// Signed 256-bit integer.
    I256(I256),
}

impl From<ParseUnits> for U256 {
    #[inline]
    fn from(value: ParseUnits) -> Self {
        value.get_absolute()
    }
}

impl From<ParseUnits> for I256 {
    #[inline]
    fn from(value: ParseUnits) -> Self {
        value.get_signed()
    }
}

impl fmt::Display for ParseUnits {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::U256(val) => val.fmt(f),
            Self::I256(val) => val.fmt(f),
        }
    }
}

macro_rules! impl_from_integers {
    ($convert:ident($($t:ty),* $(,)?)) => {$(
        impl From<$t> for ParseUnits {
            fn from(value: $t) -> Self {
                Self::$convert($convert::try_from(value).unwrap())
            }
        }
    )*}
}

impl_from_integers!(U256(u8, u16, u32, u64, u128, usize, U256));
impl_from_integers!(I256(i8, i16, i32, i64, i128, isize, I256));

macro_rules! impl_try_into_absolute {
    ($($t:ty),* $(,)?) => { $(
        impl TryFrom<ParseUnits> for $t {
            type Error = <$t as TryFrom<U256>>::Error;

            fn try_from(value: ParseUnits) -> Result<Self, Self::Error> {
                <$t>::try_from(value.get_absolute())
            }
        }
    )* };
}

impl_try_into_absolute!(u64, u128);

/// Decimal separator for number formatting
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub enum DecimalSeparator {
    /// Use comma as decimal separator
    Comma,
    /// Use period as decimal separator
    #[default]
    Period,
}

impl DecimalSeparator {
    /// Returns the character used as decimal separator
    #[inline]
    pub const fn separator(&self) -> char {
        match self {
            Self::Comma => ',',
            Self::Period => '.',
        }
    }
}

impl ParseUnits {
    /// Parses a decimal number and multiplies it with 10^units.
    ///
    /// See [`parse_units`] for more information.
    #[allow(clippy::self_named_constructors)]
    pub fn parse_units(amount: &str, unit: Unit) -> Result<Self, UnitsError> {
        let exponent = unit.get() as usize;

        let mut amount = amount.to_string();
        let negative = amount.starts_with('-');
        let dec_len = if let Some(di) = amount.find('.') {
            amount.remove(di);
            amount[di..].len()
        } else {
            0
        };
        let amount = amount.as_str();

        if dec_len > exponent {
            // Truncate the decimal part if it is longer than the exponent
            let amount = &amount[..(amount.len() - (dec_len - exponent))];
            if negative {
                // Edge case: We have removed the entire number and only the negative sign is left.
                //            Return 0 as a I256 given the input was signed.
                if amount == "-" {
                    Ok(Self::I256(I256::ZERO))
                } else {
                    Ok(Self::I256(I256::from_dec_str(amount)?))
                }
            } else {
                Ok(Self::U256(U256::from_str_radix(amount, 10)?))
            }
        } else if negative {
            // Edge case: Only a negative sign was given, return 0 as a I256 given the input was
            // signed.
            if amount == "-" {
                Ok(Self::I256(I256::ZERO))
            } else {
                let mut n = I256::from_dec_str(amount)?;
                n *= I256::try_from(10u8)
                    .unwrap()
                    .checked_pow(U256::from(exponent - dec_len))
                    .ok_or(UnitsError::ParseSigned(ParseSignedError::IntegerOverflow))?;
                Ok(Self::I256(n))
            }
        } else {
            let mut a_uint = U256::from_str_radix(amount, 10)?;
            a_uint *= U256::from(10)
                .checked_pow(U256::from(exponent - dec_len))
                .ok_or(UnitsError::ParseSigned(ParseSignedError::IntegerOverflow))?;
            Ok(Self::U256(a_uint))
        }
    }

    /// Formats the given number of Wei as the given unit.
    pub fn format_units_with(&self, mut unit: Unit, separator: DecimalSeparator) -> String {
        // Edge case: If the number is signed and the unit is the largest possible unit, we need to
        //            subtract 1 from the unit to avoid overflow.
        if self.is_signed() && unit == Unit::MAX {
            unit = Unit::new(Unit::MAX.get() - 1).unwrap();
        }
        let units = unit.get() as usize;
        let exp10 = unit.wei();

        // TODO: `decimals` are formatted twice because U256 does not support alignment
        // (`:0>width`).
        match *self {
            Self::U256(amount) => {
                let integer = amount / exp10;
                let decimals = (amount % exp10).to_string();
                format!("{integer}{}{decimals:0>units$}", separator.separator())
            }
            Self::I256(amount) => {
                let exp10 = I256::from_raw(exp10);
                let sign = if amount.is_negative() { "-" } else { "" };
                let integer = (amount / exp10).twos_complement();
                let decimals = ((amount % exp10).twos_complement()).to_string();
                format!("{sign}{integer}{}{decimals:0>units$}", separator.separator())
            }
        }
    }

    /// Formats the given number of Wei as the given unit.
    ///
    /// See [`format_units`] for more information.
    pub fn format_units(&self, unit: Unit) -> String {
        self.format_units_with(unit, DecimalSeparator::Period)
    }

    /// Returns `true` if the number is signed.
    #[inline]
    pub const fn is_signed(&self) -> bool {
        matches!(self, Self::I256(_))
    }

    /// Returns `true` if the number is unsigned.
    #[inline]
    pub const fn is_unsigned(&self) -> bool {
        matches!(self, Self::U256(_))
    }

    /// Returns `true` if the number is negative.
    #[inline]
    pub const fn is_negative(&self) -> bool {
        match self {
            Self::U256(_) => false,
            Self::I256(n) => n.is_negative(),
        }
    }

    /// Returns `true` if the number is positive.
    #[inline]
    pub const fn is_positive(&self) -> bool {
        match self {
            Self::U256(_) => true,
            Self::I256(n) => n.is_positive(),
        }
    }

    /// Returns `true` if the number is zero.
    #[inline]
    pub fn is_zero(&self) -> bool {
        match self {
            Self::U256(n) => n.is_zero(),
            Self::I256(n) => n.is_zero(),
        }
    }

    /// Returns the absolute value of the number.
    #[inline]
    pub const fn get_absolute(self) -> U256 {
        match self {
            Self::U256(n) => n,
            Self::I256(n) => n.into_raw(),
        }
    }

    /// Returns the signed value of the number.
    #[inline]
    pub const fn get_signed(self) -> I256 {
        match self {
            Self::U256(n) => I256::from_raw(n),
            Self::I256(n) => n,
        }
    }
}

/// Ethereum unit. Always less than [`77`](Unit::MAX).
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Unit(u8);

impl fmt::Display for Unit {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.get().fmt(f)
    }
}

impl TryFrom<u8> for Unit {
    type Error = UnitsError;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        Self::new(value).ok_or_else(|| UnitsError::InvalidUnit(value.to_string()))
    }
}

impl TryFrom<String> for Unit {
    type Error = UnitsError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        value.parse()
    }
}

impl<'a> TryFrom<&'a String> for Unit {
    type Error = UnitsError;

    fn try_from(value: &'a String) -> Result<Self, Self::Error> {
        value.parse()
    }
}

impl TryFrom<&str> for Unit {
    type Error = UnitsError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        value.parse()
    }
}

impl core::str::FromStr for Unit {
    type Err = UnitsError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Ok(unit) = crate::U8::from_str(s) {
            return Self::new(unit.to()).ok_or_else(|| UnitsError::InvalidUnit(s.to_string()));
        }

        Ok(match s.to_ascii_lowercase().as_str() {
            "eth" | "ether" => Self::ETHER,
            "pwei" | "milli" | "milliether" | "finney" => Self::PWEI,
            "twei" | "micro" | "microether" | "szabo" => Self::TWEI,
            "gwei" | "nano" | "nanoether" | "shannon" => Self::GWEI,
            "mwei" | "pico" | "picoether" | "lovelace" => Self::MWEI,
            "kwei" | "femto" | "femtoether" | "babbage" => Self::KWEI,
            "wei" => Self::WEI,
            _ => return Err(UnitsError::InvalidUnit(s.to_string())),
        })
    }
}

impl Unit {
    /// Wei is equivalent to 1 wei.
    pub const WEI: Self = unsafe { Self::new_unchecked(0) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::WEI` instead")]
    pub const Wei: Self = Self::WEI;

    /// Kwei is equivalent to 1e3 wei.
    pub const KWEI: Self = unsafe { Self::new_unchecked(3) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::KWEI` instead")]
    pub const Kwei: Self = Self::KWEI;

    /// Mwei is equivalent to 1e6 wei.
    pub const MWEI: Self = unsafe { Self::new_unchecked(6) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::MWEI` instead")]
    pub const Mwei: Self = Self::MWEI;

    /// Gwei is equivalent to 1e9 wei.
    pub const GWEI: Self = unsafe { Self::new_unchecked(9) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::GWEI` instead")]
    pub const Gwei: Self = Self::GWEI;

    /// Twei is equivalent to 1e12 wei.
    pub const TWEI: Self = unsafe { Self::new_unchecked(12) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::TWEI` instead")]
    pub const Twei: Self = Self::TWEI;

    /// Pwei is equivalent to 1e15 wei.
    pub const PWEI: Self = unsafe { Self::new_unchecked(15) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::PWEI` instead")]
    pub const Pwei: Self = Self::PWEI;

    /// Ether is equivalent to 1e18 wei.
    pub const ETHER: Self = unsafe { Self::new_unchecked(18) };
    #[allow(non_upper_case_globals)]
    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `Unit::ETHER` instead")]
    pub const Ether: Self = Self::ETHER;

    /// The smallest unit.
    pub const MIN: Self = Self::WEI;
    /// The largest unit.
    pub const MAX: Self = unsafe { Self::new_unchecked(77) };

    /// Creates a new `Unit` instance, checking for overflow.
    #[inline]
    pub const fn new(units: u8) -> Option<Self> {
        if units <= Self::MAX.get() {
            // SAFETY: `units` is contained in the valid range.
            Some(unsafe { Self::new_unchecked(units) })
        } else {
            None
        }
    }

    /// Creates a new `Unit` instance.
    ///
    /// # Safety
    ///
    /// `x` must be less than [`Unit::MAX`].
    #[inline]
    pub const unsafe fn new_unchecked(x: u8) -> Self {
        Self(x)
    }

    /// Returns `10^self`, which is the number of Wei in this unit.
    ///
    /// # Examples
    ///
    /// ```
    /// use alloy_primitives::{utils::Unit, U256};
    ///
    /// assert_eq!(U256::from(1u128), Unit::WEI.wei());
    /// assert_eq!(U256::from(1_000u128), Unit::KWEI.wei());
    /// assert_eq!(U256::from(1_000_000u128), Unit::MWEI.wei());
    /// assert_eq!(U256::from(1_000_000_000u128), Unit::GWEI.wei());
    /// assert_eq!(U256::from(1_000_000_000_000u128), Unit::TWEI.wei());
    /// assert_eq!(U256::from(1_000_000_000_000_000u128), Unit::PWEI.wei());
    /// assert_eq!(U256::from(1_000_000_000_000_000_000u128), Unit::ETHER.wei());
    /// ```
    #[inline]
    pub fn wei(self) -> U256 {
        if self.get() <= MAX_U64_EXPONENT {
            self.wei_const()
        } else {
            U256::from(10u8).pow(U256::from(self.get()))
        }
    }

    /// Returns `10^self`, which is the number of Wei in this unit.
    ///
    /// # Panics
    ///
    /// Panics if `10^self` would overflow a `u64` (`self > 19`). If this can happen, use
    /// [`wei`](Self::wei) instead.
    #[inline]
    pub const fn wei_const(self) -> U256 {
        if self.get() > MAX_U64_EXPONENT {
            panic!("overflow")
        }
        U256::from_limbs([10u64.pow(self.get() as u32), 0, 0, 0])
    }

    /// Returns the numeric value of the unit.
    #[inline]
    pub const fn get(self) -> u8 {
        self.0
    }

    #[doc(hidden)]
    #[deprecated(since = "0.5.0", note = "use `get` instead")]
    pub const fn as_num(&self) -> u8 {
        self.get()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn unit_values() {
        assert_eq!(Unit::WEI.get(), 0);
        assert_eq!(Unit::KWEI.get(), 3);
        assert_eq!(Unit::MWEI.get(), 6);
        assert_eq!(Unit::GWEI.get(), 9);
        assert_eq!(Unit::TWEI.get(), 12);
        assert_eq!(Unit::PWEI.get(), 15);
        assert_eq!(Unit::ETHER.get(), 18);
        assert_eq!(Unit::new(10).unwrap().get(), 10);
        assert_eq!(Unit::new(20).unwrap().get(), 20);
    }

    #[test]
    fn unit_wei() {
        let assert = |unit: Unit| {
            let wei = unit.wei();
            assert_eq!(wei.to::<u128>(), 10u128.pow(unit.get() as u32));
            assert_eq!(wei, U256::from(10u8).pow(U256::from(unit.get())));
        };
        assert(Unit::WEI);
        assert(Unit::KWEI);
        assert(Unit::MWEI);
        assert(Unit::GWEI);
        assert(Unit::TWEI);
        assert(Unit::PWEI);
        assert(Unit::ETHER);
        assert(Unit::new(10).unwrap());
        assert(Unit::new(20).unwrap());
    }

    #[test]
    fn parse() {
        assert_eq!(Unit::try_from("wei").unwrap(), Unit::WEI);
        assert_eq!(Unit::try_from("kwei").unwrap(), Unit::KWEI);
        assert_eq!(Unit::try_from("mwei").unwrap(), Unit::MWEI);
        assert_eq!(Unit::try_from("gwei").unwrap(), Unit::GWEI);
        assert_eq!(Unit::try_from("twei").unwrap(), Unit::TWEI);
        assert_eq!(Unit::try_from("pwei").unwrap(), Unit::PWEI);
        assert_eq!(Unit::try_from("ether").unwrap(), Unit::ETHER);
    }

    #[test]
    fn wei_in_ether() {
        assert_eq!(Unit::ETHER.wei(), U256::from(1e18 as u64));
    }

    #[test]
    fn test_format_ether_unsigned() {
        let eth = format_ether(Unit::ETHER.wei());
        assert_eq!(eth.parse::<f64>().unwrap() as u64, 1);

        let eth = format_ether(1395633240123456000_u128);
        assert_eq!(eth.parse::<f64>().unwrap(), 1.395633240123456);

        let eth = format_ether(U256::from_str_radix("1395633240123456000", 10).unwrap());
        assert_eq!(eth.parse::<f64>().unwrap(), 1.395633240123456);

        let eth = format_ether(U256::from_str_radix("1395633240123456789", 10).unwrap());
        assert_eq!(eth, "1.395633240123456789");

        let eth = format_ether(U256::from_str_radix("1005633240123456789", 10).unwrap());
        assert_eq!(eth, "1.005633240123456789");

        let eth = format_ether(u16::MAX);
        assert_eq!(eth, "0.000000000000065535");

        // Note: This covers usize on 32 bit systems.
        let eth = format_ether(u32::MAX);
        assert_eq!(eth, "0.000000004294967295");

        // Note: This covers usize on 64 bit systems.
        let eth = format_ether(u64::MAX);
        assert_eq!(eth, "18.446744073709551615");
    }

    #[test]
    fn test_format_ether_signed() {
        let eth = format_ether(I256::from_dec_str("-1395633240123456000").unwrap());
        assert_eq!(eth.parse::<f64>().unwrap(), -1.395633240123456);

        let eth = format_ether(I256::from_dec_str("-1395633240123456789").unwrap());
        assert_eq!(eth, "-1.395633240123456789");

        let eth = format_ether(I256::from_dec_str("1005633240123456789").unwrap());
        assert_eq!(eth, "1.005633240123456789");

        let eth = format_ether(i8::MIN);
        assert_eq!(eth, "-0.000000000000000128");

        let eth = format_ether(i8::MAX);
        assert_eq!(eth, "0.000000000000000127");

        let eth = format_ether(i16::MIN);
        assert_eq!(eth, "-0.000000000000032768");

        // Note: This covers isize on 32 bit systems.
        let eth = format_ether(i32::MIN);
        assert_eq!(eth, "-0.000000002147483648");

        // Note: This covers isize on 64 bit systems.
        let eth = format_ether(i64::MIN);
        assert_eq!(eth, "-9.223372036854775808");
    }

    #[test]
    fn test_format_units_unsigned() {
        let gwei_in_ether = format_units(Unit::ETHER.wei(), 9).unwrap();
        assert_eq!(gwei_in_ether.parse::<f64>().unwrap() as u64, 1e9 as u64);

        let eth = format_units(Unit::ETHER.wei(), "ether").unwrap();
        assert_eq!(eth.parse::<f64>().unwrap() as u64, 1);

        let eth = format_units(1395633240123456000_u128, "ether").unwrap();
        assert_eq!(eth.parse::<f64>().unwrap(), 1.395633240123456);

        let eth = format_units(U256::from_str_radix("1395633240123456000", 10).unwrap(), "ether")
            .unwrap();
        assert_eq!(eth.parse::<f64>().unwrap(), 1.395633240123456);

        let eth = format_units(U256::from_str_radix("1395633240123456789", 10).unwrap(), "ether")
            .unwrap();
        assert_eq!(eth, "1.395633240123456789");

        let eth = format_units(U256::from_str_radix("1005633240123456789", 10).unwrap(), "ether")
            .unwrap();
        assert_eq!(eth, "1.005633240123456789");

        let eth = format_units(u8::MAX, 4).unwrap();
        assert_eq!(eth, "0.0255");

        let eth = format_units(u16::MAX, "ether").unwrap();
        assert_eq!(eth, "0.000000000000065535");

        // Note: This covers usize on 32 bit systems.
        let eth = format_units(u32::MAX, 18).unwrap();
        assert_eq!(eth, "0.000000004294967295");

        // Note: This covers usize on 64 bit systems.
        let eth = format_units(u64::MAX, "gwei").unwrap();
        assert_eq!(eth, "18446744073.709551615");

        let eth = format_units(u128::MAX, 36).unwrap();
        assert_eq!(eth, "340.282366920938463463374607431768211455");

        let eth = format_units(U256::MAX, 77).unwrap();
        assert_eq!(
            eth,
            "1.15792089237316195423570985008687907853269984665640564039457584007913129639935"
        );

        let _err = format_units(U256::MAX, 78).unwrap_err();
        let _err = format_units(U256::MAX, 79).unwrap_err();
    }

    #[test]
    fn test_format_units_signed() {
        let eth =
            format_units(I256::from_dec_str("-1395633240123456000").unwrap(), "ether").unwrap();
        assert_eq!(eth.parse::<f64>().unwrap(), -1.395633240123456);

        let eth =
            format_units(I256::from_dec_str("-1395633240123456789").unwrap(), "ether").unwrap();
        assert_eq!(eth, "-1.395633240123456789");

        let eth =
            format_units(I256::from_dec_str("1005633240123456789").unwrap(), "ether").unwrap();
        assert_eq!(eth, "1.005633240123456789");

        let eth = format_units(i8::MIN, 4).unwrap();
        assert_eq!(eth, "-0.0128");
        assert_eq!(eth.parse::<f64>().unwrap(), -0.0128_f64);

        let eth = format_units(i8::MAX, 4).unwrap();
        assert_eq!(eth, "0.0127");
        assert_eq!(eth.parse::<f64>().unwrap(), 0.0127);

        let eth = format_units(i16::MIN, "ether").unwrap();
        assert_eq!(eth, "-0.000000000000032768");

        // Note: This covers isize on 32 bit systems.
        let eth = format_units(i32::MIN, 18).unwrap();
        assert_eq!(eth, "-0.000000002147483648");

        // Note: This covers isize on 64 bit systems.
        let eth = format_units(i64::MIN, "gwei").unwrap();
        assert_eq!(eth, "-9223372036.854775808");

        let eth = format_units(i128::MIN, 36).unwrap();
        assert_eq!(eth, "-170.141183460469231731687303715884105728");

        let eth = format_units(I256::MIN, 76).unwrap();
        let min = "-5.7896044618658097711785492504343953926634992332820282019728792003956564819968";
        assert_eq!(eth, min);
        // doesn't error
        let eth = format_units(I256::MIN, 77).unwrap();
        assert_eq!(eth, min);

        let _err = format_units(I256::MIN, 78).unwrap_err();
        let _err = format_units(I256::MIN, 79).unwrap_err();
    }

    #[test]
    fn parse_large_units() {
        let decimals = 27u8;
        let val = "10.55";

        let n: U256 = parse_units(val, decimals).unwrap().into();
        assert_eq!(n.to_string(), "10550000000000000000000000000");
    }

    #[test]
    fn test_parse_units() {
        let gwei: U256 = parse_units("1.5", 9).unwrap().into();
        assert_eq!(gwei, U256::from(15e8 as u64));

        let token: U256 = parse_units("1163.56926418", 8).unwrap().into();
        assert_eq!(token, U256::from(116356926418u64));

        let eth_dec_float: U256 = parse_units("1.39563324", "ether").unwrap().into();
        assert_eq!(eth_dec_float, U256::from_str_radix("1395633240000000000", 10).unwrap());

        let eth_dec_string: U256 = parse_units("1.39563324", "ether").unwrap().into();
        assert_eq!(eth_dec_string, U256::from_str_radix("1395633240000000000", 10).unwrap());

        let eth: U256 = parse_units("1", "ether").unwrap().into();
        assert_eq!(eth, Unit::ETHER.wei());

        let val: U256 = parse_units("2.3", "ether").unwrap().into();
        assert_eq!(val, U256::from_str_radix("2300000000000000000", 10).unwrap());

        let n: U256 = parse_units(".2", 2).unwrap().into();
        assert_eq!(n, U256::from(20), "leading dot");

        let n: U256 = parse_units("333.21", 2).unwrap().into();
        assert_eq!(n, U256::from(33321), "trailing dot");

        let n: U256 = parse_units("98766", 16).unwrap().into();
        assert_eq!(n, U256::from_str_radix("987660000000000000000", 10).unwrap(), "no dot");

        let n: U256 = parse_units("3_3_0", 3).unwrap().into();
        assert_eq!(n, U256::from(330000), "underscore");

        let n: U256 = parse_units("330", 0).unwrap().into();
        assert_eq!(n, U256::from(330), "zero decimals");

        let n: U256 = parse_units(".1234", 3).unwrap().into();
        assert_eq!(n, U256::from(123), "truncate too many decimals");

        assert!(parse_units("1", 80).is_err(), "overflow");

        let two_e30 = U256::from(2) * U256::from_limbs([0x4674edea40000000, 0xc9f2c9cd0, 0x0, 0x0]);
        let n: U256 = parse_units("2", 30).unwrap().into();
        assert_eq!(n, two_e30, "2e30");

        let n: U256 = parse_units(".33_319_2", 0).unwrap().into();
        assert_eq!(n, U256::ZERO, "mix");

        let n: U256 = parse_units("", 3).unwrap().into();
        assert_eq!(n, U256::ZERO, "empty");
    }

    #[test]
    fn test_signed_parse_units() {
        let gwei: I256 = parse_units("-1.5", 9).unwrap().into();
        assert_eq!(gwei.as_i64(), -15e8 as i64);

        let token: I256 = parse_units("-1163.56926418", 8).unwrap().into();
        assert_eq!(token.as_i64(), -116356926418);

        let eth_dec_float: I256 = parse_units("-1.39563324", "ether").unwrap().into();
        assert_eq!(eth_dec_float, I256::from_dec_str("-1395633240000000000").unwrap());

        let eth_dec_string: I256 = parse_units("-1.39563324", "ether").unwrap().into();
        assert_eq!(eth_dec_string, I256::from_dec_str("-1395633240000000000").unwrap());

        let eth: I256 = parse_units("-1", "ether").unwrap().into();
        assert_eq!(eth, I256::from_raw(Unit::ETHER.wei()) * I256::MINUS_ONE);

        let val: I256 = parse_units("-2.3", "ether").unwrap().into();
        assert_eq!(val, I256::from_dec_str("-2300000000000000000").unwrap());

        let n: I256 = parse_units("-.2", 2).unwrap().into();
        assert_eq!(n, I256::try_from(-20).unwrap(), "leading dot");

        let n: I256 = parse_units("-333.21", 2).unwrap().into();
        assert_eq!(n, I256::try_from(-33321).unwrap(), "trailing dot");

        let n: I256 = parse_units("-98766", 16).unwrap().into();
        assert_eq!(n, I256::from_dec_str("-987660000000000000000").unwrap(), "no dot");

        let n: I256 = parse_units("-3_3_0", 3).unwrap().into();
        assert_eq!(n, I256::try_from(-330000).unwrap(), "underscore");

        let n: I256 = parse_units("-330", 0).unwrap().into();
        assert_eq!(n, I256::try_from(-330).unwrap(), "zero decimals");

        let n: I256 = parse_units("-.1234", 3).unwrap().into();
        assert_eq!(n, I256::try_from(-123).unwrap(), "truncate too many decimals");

        assert!(parse_units("-1", 80).is_err(), "overflow");

        let two_e30 = I256::try_from(-2).unwrap()
            * I256::from_raw(U256::from_limbs([0x4674edea40000000, 0xc9f2c9cd0, 0x0, 0x0]));
        let n: I256 = parse_units("-2", 30).unwrap().into();
        assert_eq!(n, two_e30, "-2e30");

        let n: I256 = parse_units("-.33_319_2", 0).unwrap().into();
        assert_eq!(n, I256::ZERO, "mix");

        let n: I256 = parse_units("-", 3).unwrap().into();
        assert_eq!(n, I256::ZERO, "empty");
    }
}
```
```rs [./src/utils/mod.rs]
//! Common Ethereum utilities.

use crate::B256;
use alloc::{boxed::Box, collections::TryReserveError, vec::Vec};
use cfg_if::cfg_if;
use core::{
    fmt,
    mem::{ManuallyDrop, MaybeUninit},
};

mod units;
pub use units::{
    format_ether, format_units, parse_ether, parse_units, DecimalSeparator, ParseUnits, Unit,
    UnitsError,
};

#[doc(hidden)]
#[deprecated(since = "0.5.0", note = "use `Unit::ETHER.wei()` instead")]
pub const WEI_IN_ETHER: crate::U256 = Unit::ETHER.wei_const();

#[doc(hidden)]
#[deprecated(since = "0.5.0", note = "use `Unit` instead")]
pub type Units = Unit;

/// The prefix used for hashing messages according to EIP-191.
pub const EIP191_PREFIX: &str = "\x19Ethereum Signed Message:\n";

/// The [Keccak-256](keccak256) hash of the empty string `""`.
pub const KECCAK256_EMPTY: B256 =
    b256!("0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");

/// Tries to create a [`Vec`] containing the arguments.
#[macro_export]
macro_rules! try_vec {
    () => {
        $crate::private::Vec::new()
    };
    ($elem:expr; $n:expr) => {
        $crate::utils::vec_try_from_elem($elem, $n)
    };
    ($($x:expr),+ $(,)?) => {
        match $crate::utils::box_try_new([$($x),+]) {
            ::core::result::Result::Ok(x) => ::core::result::Result::Ok(<[_]>::into_vec(x)),
            ::core::result::Result::Err(e) => ::core::result::Result::Err(e),
        }
    };
}

/// Allocates memory on the heap then places `x` into it, returning an error if the allocation
/// fails.
///
/// Stable version of `Box::try_new`.
#[inline]
pub fn box_try_new<T>(value: T) -> Result<Box<T>, TryReserveError> {
    let mut boxed = box_try_new_uninit::<T>()?;
    unsafe {
        boxed.as_mut_ptr().write(value);
        let ptr = Box::into_raw(boxed);
        Ok(Box::from_raw(ptr.cast()))
    }
}

/// Constructs a new box with uninitialized contents on the heap, returning an error if the
/// allocation fails.
///
/// Stable version of `Box::try_new_uninit`.
#[inline]
pub fn box_try_new_uninit<T>() -> Result<Box<MaybeUninit<T>>, TryReserveError> {
    let mut vec = Vec::<MaybeUninit<T>>::new();

    // Reserve enough space for one `MaybeUninit<T>`.
    vec.try_reserve_exact(1)?;

    // `try_reserve_exact`'s docs note that the allocator might allocate more than requested anyway.
    // Make sure we got exactly 1 element.
    vec.shrink_to(1);

    let mut vec = ManuallyDrop::new(vec);

    // SAFETY: `vec` is exactly one element long and has not been deallocated.
    Ok(unsafe { Box::from_raw(vec.as_mut_ptr()) })
}

/// Tries to collect the elements of an iterator into a `Vec`.
pub fn try_collect_vec<I: Iterator<Item = T>, T>(iter: I) -> Result<Vec<T>, TryReserveError> {
    let mut vec = Vec::new();
    if let Some(size_hint) = iter.size_hint().1 {
        vec.try_reserve(size_hint.max(4))?;
    }
    vec.extend(iter);
    Ok(vec)
}

/// Tries to create a `Vec` with the given capacity.
#[inline]
pub fn vec_try_with_capacity<T>(capacity: usize) -> Result<Vec<T>, TryReserveError> {
    let mut vec = Vec::new();
    vec.try_reserve(capacity).map(|()| vec)
}

/// Tries to create a `Vec` of `n` elements, each initialized to `elem`.
// Not public API. Use `try_vec!` instead.
#[doc(hidden)]
pub fn vec_try_from_elem<T: Clone>(elem: T, n: usize) -> Result<Vec<T>, TryReserveError> {
    let mut vec = Vec::new();
    vec.try_reserve(n)?;
    vec.resize(n, elem);
    Ok(vec)
}

/// Hash a message according to [EIP-191] (version `0x01`).
///
/// The final message is a UTF-8 string, encoded as follows:
/// `"\x19Ethereum Signed Message:\n" + message.length + message`
///
/// This message is then hashed using [Keccak-256](keccak256).
///
/// [EIP-191]: https://eips.ethereum.org/EIPS/eip-191
pub fn eip191_hash_message<T: AsRef<[u8]>>(message: T) -> B256 {
    keccak256(eip191_message(message))
}

/// Constructs a message according to [EIP-191] (version `0x01`).
///
/// The final message is a UTF-8 string, encoded as follows:
/// `"\x19Ethereum Signed Message:\n" + message.length + message`
///
/// [EIP-191]: https://eips.ethereum.org/EIPS/eip-191
pub fn eip191_message<T: AsRef<[u8]>>(message: T) -> Vec<u8> {
    fn eip191_message(message: &[u8]) -> Vec<u8> {
        let len = message.len();
        let mut len_string_buffer = itoa::Buffer::new();
        let len_string = len_string_buffer.format(len);

        let mut eth_message = Vec::with_capacity(EIP191_PREFIX.len() + len_string.len() + len);
        eth_message.extend_from_slice(EIP191_PREFIX.as_bytes());
        eth_message.extend_from_slice(len_string.as_bytes());
        eth_message.extend_from_slice(message);
        eth_message
    }

    eip191_message(message.as_ref())
}

/// Simple interface to the [`Keccak-256`] hash function.
///
/// [`Keccak-256`]: https://en.wikipedia.org/wiki/SHA-3
pub fn keccak256<T: AsRef<[u8]>>(bytes: T) -> B256 {
    fn keccak256(bytes: &[u8]) -> B256 {
        let mut output = MaybeUninit::<B256>::uninit();

        cfg_if! {
            if #[cfg(all(feature = "native-keccak", not(any(feature = "sha3-keccak", feature = "tiny-keccak", miri))))] {
                #[link(wasm_import_module = "vm_hooks")]
                extern "C" {
                    /// When targeting VMs with native keccak hooks, the `native-keccak` feature
                    /// can be enabled to import and use the host environment's implementation
                    /// of [`keccak256`] in place of [`sha3`] or [`tiny_keccak`]. This is overridden
                    /// when the `sha3-keccak` or `tiny-keccak` feature is enabled.
                    ///
                    /// # Safety
                    ///
                    /// The VM accepts the preimage by pointer and length, and writes the
                    /// 32-byte hash.
                    /// - `bytes` must point to an input buffer at least `len` long.
                    /// - `output` must point to a buffer that is at least 32-bytes long.
                    ///
                    /// [`keccak256`]: https://en.wikipedia.org/wiki/SHA-3
                    /// [`sha3`]: https://docs.rs/sha3/latest/sha3/
                    /// [`tiny_keccak`]: https://docs.rs/tiny-keccak/latest/tiny_keccak/
                    fn native_keccak256(bytes: *const u8, len: usize, output: *mut u8);
                }

                // SAFETY: The output is 32-bytes, and the input comes from a slice.
                unsafe { native_keccak256(bytes.as_ptr(), bytes.len(), output.as_mut_ptr().cast::<u8>()) };
            } else {
                let mut hasher = Keccak256::new();
                hasher.update(bytes);
                // SAFETY: Never reads from `output`.
                unsafe { hasher.finalize_into_raw(output.as_mut_ptr().cast()) };
            }
        }

        // SAFETY: Initialized above.
        unsafe { output.assume_init() }
    }

    keccak256(bytes.as_ref())
}

mod keccak256_state {
    cfg_if::cfg_if! {
        if #[cfg(all(feature = "asm-keccak", not(miri)))] {
            pub(super) use keccak_asm::Digest;

            pub(super) type State = keccak_asm::Keccak256;
        } else if #[cfg(feature = "sha3-keccak")] {
            pub(super) use sha3::Digest;

            pub(super) type State = sha3::Keccak256;
        } else {
            pub(super) use tiny_keccak::Hasher as Digest;

            /// Wraps `tiny_keccak::Keccak` to implement `Digest`-like API.
            #[derive(Clone)]
            pub(super) struct State(tiny_keccak::Keccak);

            impl State {
                #[inline]
                pub(super) fn new() -> Self {
                    Self(tiny_keccak::Keccak::v256())
                }

                #[inline]
                pub(super) fn finalize_into(self, output: &mut [u8; 32]) {
                    self.0.finalize(output);
                }

                #[inline]
                pub(super) fn update(&mut self, bytes: &[u8]) {
                    self.0.update(bytes);
                }
            }
        }
    }
}
#[allow(unused_imports)]
use keccak256_state::Digest;

/// Simple [`Keccak-256`] hasher.
///
/// Note that the "native-keccak" feature is not supported for this struct, and will default to the
/// [`tiny_keccak`] implementation.
///
/// [`Keccak-256`]: https://en.wikipedia.org/wiki/SHA-3
#[derive(Clone)]
pub struct Keccak256 {
    state: keccak256_state::State,
}

impl Default for Keccak256 {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl fmt::Debug for Keccak256 {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Keccak256").finish_non_exhaustive()
    }
}

impl Keccak256 {
    /// Creates a new [`Keccak256`] hasher.
    #[inline]
    pub fn new() -> Self {
        Self { state: keccak256_state::State::new() }
    }

    /// Absorbs additional input. Can be called multiple times.
    #[inline]
    pub fn update(&mut self, bytes: impl AsRef<[u8]>) {
        self.state.update(bytes.as_ref());
    }

    /// Pad and squeeze the state.
    #[inline]
    pub fn finalize(self) -> B256 {
        let mut output = MaybeUninit::<B256>::uninit();
        // SAFETY: The output is 32-bytes.
        unsafe { self.finalize_into_raw(output.as_mut_ptr().cast()) };
        // SAFETY: Initialized above.
        unsafe { output.assume_init() }
    }

    /// Pad and squeeze the state into `output`.
    ///
    /// # Panics
    ///
    /// Panics if `output` is not 32 bytes long.
    #[inline]
    #[track_caller]
    pub fn finalize_into(self, output: &mut [u8]) {
        self.finalize_into_array(output.try_into().unwrap())
    }

    /// Pad and squeeze the state into `output`.
    #[inline]
    #[allow(clippy::useless_conversion)]
    pub fn finalize_into_array(self, output: &mut [u8; 32]) {
        self.state.finalize_into(output.into());
    }

    /// Pad and squeeze the state into `output`.
    ///
    /// # Safety
    ///
    /// `output` must point to a buffer that is at least 32-bytes long.
    #[inline]
    pub unsafe fn finalize_into_raw(self, output: *mut u8) {
        self.finalize_into_array(&mut *output.cast::<[u8; 32]>())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloc::string::ToString;

    // test vector taken from:
    // https://web3js.readthedocs.io/en/v1.10.0/web3-eth-accounts.html#hashmessage
    #[test]
    fn test_hash_message() {
        let msg = "Hello World";
        let eip191_msg = eip191_message(msg);
        let hash = keccak256(&eip191_msg);
        assert_eq!(
            eip191_msg,
            [EIP191_PREFIX.as_bytes(), msg.len().to_string().as_bytes(), msg.as_bytes()].concat()
        );
        assert_eq!(
            hash,
            b256!("0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2")
        );
        assert_eq!(eip191_hash_message(msg), hash);
    }

    #[test]
    fn keccak256_hasher() {
        let expected = b256!("0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad");
        assert_eq!(keccak256("hello world"), expected);

        let mut hasher = Keccak256::new();
        hasher.update(b"hello");
        hasher.update(b" world");

        assert_eq!(hasher.clone().finalize(), expected);

        let mut hash = [0u8; 32];
        hasher.clone().finalize_into(&mut hash);
        assert_eq!(hash, expected);

        let mut hash = [0u8; 32];
        hasher.clone().finalize_into_array(&mut hash);
        assert_eq!(hash, expected);

        let mut hash = [0u8; 32];
        unsafe { hasher.finalize_into_raw(hash.as_mut_ptr()) };
        assert_eq!(hash, expected);
    }

    #[test]
    fn test_try_boxing() {
        let x = Box::new(42);
        let y = box_try_new(42).unwrap();
        assert_eq!(x, y);

        let x = vec![1; 3];
        let y = try_vec![1; 3].unwrap();
        assert_eq!(x, y);

        let x = vec![1, 2, 3];
        let y = try_vec![1, 2, 3].unwrap();
        assert_eq!(x, y);
    }
}
```
```rs [./src/diesel.rs]
//! Support for the [`diesel`](https://crates.io/crates/diesel) crate.
//!
//! Supports big-endian binary serialization via into sql_types::Binary.
//! Similar to [`ruint`'s implementation](https://github.com/recmo/uint/blob/fd57517b36cda8341f7740dacab4b1ec186af948/src/support/diesel.rs)

use crate::{FixedBytes, Signature, SignatureError};

use diesel::{
    backend::Backend,
    deserialize::{FromSql, Result as DeserResult},
    query_builder::bind_collector::RawBytesBindCollector,
    serialize::{IsNull, Output, Result as SerResult, ToSql},
    sql_types::Binary,
};
use std::io::Write;

impl<const BYTES: usize, Db> ToSql<Binary, Db> for FixedBytes<BYTES>
where
    for<'c> Db: Backend<BindCollector<'c> = RawBytesBindCollector<Db>>,
{
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Db>) -> SerResult {
        out.write_all(&self[..])?;
        Ok(IsNull::No)
    }
}

impl<const BYTES: usize, Db: Backend> FromSql<Binary, Db> for FixedBytes<BYTES>
where
    *const [u8]: FromSql<Binary, Db>,
{
    fn from_sql(bytes: Db::RawValue<'_>) -> DeserResult<Self> {
        let bytes: *const [u8] = FromSql::<Binary, Db>::from_sql(bytes)?;
        let bytes = unsafe { &*bytes };
        Self::try_from(bytes).map_err(|e| e.into())
    }
}

impl<Db: Backend> ToSql<Binary, Db> for Signature
where
    for<'c> Db: Backend<BindCollector<'c> = RawBytesBindCollector<Db>>,
{
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Db>) -> SerResult {
        out.write_all(&self.as_erc2098())?;
        Ok(IsNull::No)
    }
}

impl<Db: Backend> FromSql<Binary, Db> for Signature
where
    *const [u8]: FromSql<Binary, Db>,
{
    fn from_sql(bytes: Db::RawValue<'_>) -> DeserResult<Self> {
        let bytes: *const [u8] = FromSql::<Binary, Db>::from_sql(bytes)?;
        let bytes = unsafe { &*bytes };
        if bytes.len() != 64 {
            return Err(SignatureError::FromBytes("Invalid length").into());
        }
        Ok(Self::from_erc2098(bytes))
    }
}
```
```rs [./src/signed/conversions.rs]
use super::{utils::twos_complement, BigIntConversionError, ParseSignedError, Sign, Signed};
use alloc::string::String;
use core::str::FromStr;
use ruint::{ToUintError, Uint, UintTryFrom};

impl<const BITS: usize, const LIMBS: usize> TryFrom<Uint<BITS, LIMBS>> for Signed<BITS, LIMBS> {
    type Error = BigIntConversionError;

    #[inline]
    fn try_from(from: Uint<BITS, LIMBS>) -> Result<Self, Self::Error> {
        let value = Self(from);
        match value.sign() {
            Sign::Positive => Ok(value),
            Sign::Negative => Err(BigIntConversionError),
        }
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<Signed<BITS, LIMBS>> for Uint<BITS, LIMBS> {
    type Error = BigIntConversionError;

    #[inline]
    fn try_from(value: Signed<BITS, LIMBS>) -> Result<Self, Self::Error> {
        match value.sign() {
            Sign::Positive => Ok(value.0),
            Sign::Negative => Err(BigIntConversionError),
        }
    }
}

/// Conversion between `Signed` of different `BITS` or `LIMBS` length.
impl<const BITS: usize, const LIMBS: usize, const BITS_SRC: usize, const LIMBS_SRC: usize>
    UintTryFrom<Signed<BITS_SRC, LIMBS_SRC>> for Signed<BITS, LIMBS>
{
    #[inline]
    fn uint_try_from(value: Signed<BITS_SRC, LIMBS_SRC>) -> Result<Self, ToUintError<Self>> {
        let (sign, abs) = value.into_sign_and_abs();
        let resized = Self::from_raw(Uint::<BITS, LIMBS>::uint_try_from(abs).map_err(signed_err)?);
        if resized.is_negative() {
            return Err(ToUintError::ValueNegative(BITS, resized));
        }
        Ok(match sign {
            Sign::Negative => {
                resized.checked_neg().ok_or(ToUintError::ValueTooLarge(BITS, resized))?
            }
            Sign::Positive => resized,
        })
    }
}

/// Conversion from positive `Signed` to `Uint` of different `BITS` or `LIMBS` length.
impl<const BITS: usize, const LIMBS: usize, const BITS_SRC: usize, const LIMBS_SRC: usize>
    UintTryFrom<Signed<BITS_SRC, LIMBS_SRC>> for Uint<BITS, LIMBS>
{
    #[inline]
    fn uint_try_from(value: Signed<BITS_SRC, LIMBS_SRC>) -> Result<Self, ToUintError<Self>> {
        if value.is_negative() {
            return Err(ToUintError::ValueNegative(BITS, Self::uint_try_from(value.into_raw())?));
        }
        Self::uint_try_from(value.into_raw())
    }
}

/// Conversion from `Uint` to positive `Signed` of different `BITS` or `LIMBS` length.
impl<const BITS: usize, const LIMBS: usize, const BITS_SRC: usize, const LIMBS_SRC: usize>
    UintTryFrom<Uint<BITS_SRC, LIMBS_SRC>> for Signed<BITS, LIMBS>
{
    #[inline]
    fn uint_try_from(value: Uint<BITS_SRC, LIMBS_SRC>) -> Result<Self, ToUintError<Self>> {
        let resized =
            Self::from_raw(Uint::<BITS, LIMBS>::uint_try_from(value).map_err(signed_err)?);
        if resized.is_negative() {
            return Err(ToUintError::ValueNegative(BITS, resized));
        }
        Ok(resized)
    }
}

fn signed_err<const BITS: usize, const LIMBS: usize>(
    err: ToUintError<Uint<BITS, LIMBS>>,
) -> ToUintError<Signed<BITS, LIMBS>> {
    match err {
        ToUintError::ValueTooLarge(b, t) => ToUintError::ValueTooLarge(b, Signed(t)),
        ToUintError::ValueNegative(b, t) => ToUintError::ValueNegative(b, Signed(t)),
        ToUintError::NotANumber(b) => ToUintError::NotANumber(b),
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<&str> for Signed<BITS, LIMBS> {
    type Error = ParseSignedError;

    #[inline]
    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::from_str(value)
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<&String> for Signed<BITS, LIMBS> {
    type Error = ParseSignedError;

    #[inline]
    fn try_from(value: &String) -> Result<Self, Self::Error> {
        value.parse()
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<String> for Signed<BITS, LIMBS> {
    type Error = ParseSignedError;

    #[inline]
    fn try_from(value: String) -> Result<Self, Self::Error> {
        value.parse()
    }
}

impl<const BITS: usize, const LIMBS: usize> FromStr for Signed<BITS, LIMBS> {
    type Err = ParseSignedError;

    #[inline]
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (sign, s) = match s.as_bytes().first() {
            Some(b'+') => (Sign::Positive, &s[1..]),
            Some(b'-') => (Sign::Negative, &s[1..]),
            _ => (Sign::Positive, s),
        };
        let abs = Uint::<BITS, LIMBS>::from_str(s)?;
        Self::checked_from_sign_and_abs(sign, abs).ok_or(ParseSignedError::IntegerOverflow)
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<Signed<BITS, LIMBS>> for i128 {
    type Error = BigIntConversionError;

    fn try_from(value: Signed<BITS, LIMBS>) -> Result<Self, Self::Error> {
        if value.bits() > 128 {
            return Err(BigIntConversionError);
        }

        if value.is_positive() {
            Ok(u128::try_from(value.0).unwrap() as Self)
        } else {
            let u = twos_complement(value.0);
            let u = u128::try_from(u).unwrap() as Self;
            Ok((!u).wrapping_add(1))
        }
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<i128> for Signed<BITS, LIMBS> {
    type Error = BigIntConversionError;

    fn try_from(value: i128) -> Result<Self, Self::Error> {
        let u = value as u128;
        if value >= 0 {
            return Self::try_from(u);
        }

        // This is a bit messy :(
        let tc = (!u).wrapping_add(1);
        let stc = Uint::<128, 2>::saturating_from(tc);
        let (num, overflow) = Uint::<BITS, LIMBS>::overflowing_from_limbs_slice(stc.as_limbs());
        if overflow {
            return Err(BigIntConversionError);
        }
        Ok(Self(twos_complement(num)))
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<Signed<BITS, LIMBS>> for u128 {
    type Error = BigIntConversionError;

    fn try_from(value: Signed<BITS, LIMBS>) -> Result<Self, Self::Error> {
        if value.is_negative() {
            return Err(BigIntConversionError);
        }

        let saturated = Uint::<BITS, LIMBS>::saturating_from(Self::MAX);

        // if the value is greater than the saturated value, return an error
        if value > Signed(saturated) {
            return Err(BigIntConversionError);
        }

        value.into_raw().try_into().map_err(|_| BigIntConversionError)
    }
}

impl<const BITS: usize, const LIMBS: usize> TryFrom<u128> for Signed<BITS, LIMBS> {
    type Error = BigIntConversionError;

    fn try_from(value: u128) -> Result<Self, Self::Error> {
        let saturated = Uint::<BITS, LIMBS>::saturating_from(value);

        if value != saturated.to::<u128>() {
            return Err(BigIntConversionError);
        }

        Self::try_from(saturated)
    }
}

// conversions
macro_rules! impl_conversions {
    ($(
        $u:ty [$actual_low_u:ident -> $low_u:ident, $as_u:ident],
        $i:ty [$actual_low_i:ident -> $low_i:ident, $as_i:ident];
    )+) => {
        // low_*, as_*
        impl<const BITS: usize, const LIMBS: usize> Signed<BITS, LIMBS> {
            $(
                impl_conversions!(@impl_fns $u, $actual_low_u $low_u $as_u);
                impl_conversions!(@impl_fns $i, $actual_low_i $low_i $as_i);
            )+
        }

        // From<$>, TryFrom
        $(
            impl<const BITS: usize, const LIMBS: usize> TryFrom<$u> for Signed<BITS, LIMBS> {
                type Error = BigIntConversionError;

                #[inline]
                fn try_from(value: $u) -> Result<Self, Self::Error> {
                    let u = Uint::<BITS, LIMBS>::try_from(value).map_err(|_| BigIntConversionError)?;
                    Signed::checked_from_sign_and_abs(Sign::Positive, u).ok_or(BigIntConversionError)
                }
            }

            impl<const BITS: usize, const LIMBS: usize> TryFrom<$i> for Signed<BITS, LIMBS> {
                type Error = BigIntConversionError;

                #[inline]
                fn try_from(value: $i) -> Result<Self, Self::Error> {
                    let uint: $u = value as $u;

                    if value.is_positive() {
                        return Self::try_from(uint);
                    }

                    let abs = (!uint).wrapping_add(1);
                    let tc = twos_complement(Uint::<BITS, LIMBS>::from(abs));
                    Ok(Self(tc))
                }
            }

            impl<const BITS: usize, const LIMBS: usize> TryFrom<Signed<BITS, LIMBS>> for $u {
                type Error = BigIntConversionError;

                #[inline]
                fn try_from(value: Signed<BITS, LIMBS>) -> Result<$u, Self::Error> {
                    u128::try_from(value)?.try_into().map_err(|_| BigIntConversionError)
                }
            }

            impl<const BITS: usize, const LIMBS: usize> TryFrom<Signed<BITS, LIMBS>> for $i {
                type Error = BigIntConversionError;

                #[inline]
                fn try_from(value: Signed<BITS, LIMBS>) -> Result<$i, Self::Error> {
                    i128::try_from(value)?.try_into().map_err(|_| BigIntConversionError)
                }
            }
        )+
    };

    (@impl_fns $t:ty, $actual_low:ident $low:ident $as:ident) => {
        /// Low word.
        #[inline]
        pub const fn $low(&self) -> $t {
            if BITS == 0 {
                return 0
            }

            self.0.as_limbs()[0] as $t
        }

        #[doc = concat!("Conversion to ", stringify!($t) ," with overflow checking.")]
        ///
        /// # Panics
        ///
        #[doc = concat!("Panics if the number is outside the ", stringify!($t), " valid range.")]
        #[inline]
        #[track_caller]
        pub fn $as(&self) -> $t {
            <$t as TryFrom<Self>>::try_from(*self).unwrap()
        }
    };
}

impl_conversions! {
    u8   [low_u64  -> low_u8,    as_u8],    i8   [low_u64  -> low_i8,    as_i8];
    u16  [low_u64  -> low_u16,   as_u16],   i16  [low_u64  -> low_i16,   as_i16];
    u32  [low_u64  -> low_u32,   as_u32],   i32  [low_u64  -> low_i32,   as_i32];
    u64  [low_u64  -> low_u64,   as_u64],   i64  [low_u64  -> low_i64,   as_i64];
    usize[low_u64  -> low_usize, as_usize], isize[low_u64  -> low_isize, as_isize];
}
```
```rs [./src/signed/serde.rs]
use super::Signed;
use alloc::string::String;
use core::fmt;
use serde::{
    de::{self, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};

impl<const BITS: usize, const LIMBS: usize> Serialize for Signed<BITS, LIMBS> {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.collect_str(self)
    }
}

impl<'de, const BITS: usize, const LIMBS: usize> Deserialize<'de> for Signed<BITS, LIMBS> {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct SignedVisitor<const BITS: usize, const LIMBS: usize>;

        impl<const BITS: usize, const LIMBS: usize> Visitor<'_> for SignedVisitor<BITS, LIMBS> {
            type Value = Signed<BITS, LIMBS>;

            fn expecting(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                write!(f, "a {BITS} bit signed integer")
            }

            fn visit_u64<E: de::Error>(self, v: u64) -> Result<Self::Value, E> {
                Signed::try_from(v).map_err(de::Error::custom)
            }

            fn visit_u128<E: de::Error>(self, v: u128) -> Result<Self::Value, E> {
                Signed::try_from(v).map_err(de::Error::custom)
            }

            fn visit_i64<E: de::Error>(self, v: i64) -> Result<Self::Value, E> {
                Signed::try_from(v).map_err(de::Error::custom)
            }

            fn visit_i128<E: de::Error>(self, v: i128) -> Result<Self::Value, E> {
                Signed::try_from(v).map_err(de::Error::custom)
            }

            fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
                v.parse().map_err(serde::de::Error::custom)
            }

            fn visit_string<E: de::Error>(self, v: String) -> Result<Self::Value, E> {
                self.visit_str(&v)
            }
        }

        deserializer.deserialize_any(SignedVisitor)
    }
}

// TODO: Tests
```
```rs [./src/signed/int.rs]
use super::{utils::*, ParseSignedError, Sign};
use alloc::string::String;
use core::fmt;
use ruint::{BaseConvertError, Uint, UintTryFrom, UintTryTo};

/// Signed integer wrapping a `ruint::Uint`.
///
/// This signed integer implementation is fully abstract across the number of
/// bits. It wraps a [`ruint::Uint`], and co-opts the most significant bit to
/// represent the sign. The number is represented in two's complement, using the
/// underlying `Uint`'s `u64` limbs. The limbs can be accessed via the
/// [`Signed::as_limbs()`] method, and are least-significant first.
///
/// ## Aliases
///
/// We provide aliases for every bit-width divisble by 8, from 8 to 256. These
/// are located in [`crate::aliases`] and are named `I256`, `I248` etc. Most
/// users will want [`crate::I256`].
///
/// # Usage
///
/// ```
/// # use alloy_primitives::I256;
/// // Instantiate from a number
/// let a = I256::unchecked_from(1);
/// // Use `try_from` if you're not sure it'll fit
/// let b = I256::try_from(200000382).unwrap();
///
/// // Or parse from a string :)
/// let c = "100".parse::<I256>().unwrap();
/// let d = "-0x138f".parse::<I256>().unwrap();
///
/// // Preceding plus is allowed but not recommended
/// let e = "+0xdeadbeef".parse::<I256>().unwrap();
///
/// // Underscores are ignored
/// let f = "1_000_000".parse::<I256>().unwrap();
///
/// // But invalid chars are not
/// assert!("^31".parse::<I256>().is_err());
///
/// // Math works great :)
/// let g = a * b + c - d;
///
/// // And so do comparisons!
/// assert!(e > a);
///
/// // We have some useful constants too
/// assert_eq!(I256::ZERO, I256::unchecked_from(0));
/// assert_eq!(I256::ONE, I256::unchecked_from(1));
/// assert_eq!(I256::MINUS_ONE, I256::unchecked_from(-1));
/// ```
#[derive(Clone, Copy, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "arbitrary", derive(derive_arbitrary::Arbitrary, proptest_derive::Arbitrary))]
pub struct Signed<const BITS: usize, const LIMBS: usize>(pub(crate) Uint<BITS, LIMBS>);

// formatting
impl<const BITS: usize, const LIMBS: usize> fmt::Debug for Signed<BITS, LIMBS> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(self, f)
    }
}

impl<const BITS: usize, const LIMBS: usize> fmt::Display for Signed<BITS, LIMBS> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let (sign, abs) = self.into_sign_and_abs();
        sign.fmt(f)?;
        if f.sign_plus() {
            write!(f, "{abs}")
        } else {
            abs.fmt(f)
        }
    }
}

impl<const BITS: usize, const LIMBS: usize> fmt::Binary for Signed<BITS, LIMBS> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<const BITS: usize, const LIMBS: usize> fmt::Octal for Signed<BITS, LIMBS> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<const BITS: usize, const LIMBS: usize> fmt::LowerHex for Signed<BITS, LIMBS> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<const BITS: usize, const LIMBS: usize> fmt::UpperHex for Signed<BITS, LIMBS> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<const BITS: usize, const LIMBS: usize> Signed<BITS, LIMBS> {
    /// Mask for the highest limb.
    pub(crate) const MASK: u64 = ruint::mask(BITS);

    /// Location of the sign bit within the highest limb.
    pub(crate) const SIGN_BIT: u64 = sign_bit(BITS);

    /// Number of bits.
    pub const BITS: usize = BITS;

    /// The size of this integer type in bytes. Note that some bits may be
    /// forced zero if BITS is not cleanly divisible by eight.
    pub const BYTES: usize = Uint::<BITS, LIMBS>::BYTES;

    /// The minimum value.
    pub const MIN: Self = min();

    /// The maximum value.
    pub const MAX: Self = max();

    /// Zero (additive identity) of this type.
    pub const ZERO: Self = zero();

    /// One (multiplicative identity) of this type.
    pub const ONE: Self = one();

    /// Minus one (multiplicative inverse) of this type.
    pub const MINUS_ONE: Self = Self(Uint::<BITS, LIMBS>::MAX);

    /// Coerces an unsigned integer into a signed one. If the unsigned integer is greater than or
    /// equal to `1 << 255`, then the result will overflow into a negative value.
    #[inline]
    pub const fn from_raw(val: Uint<BITS, LIMBS>) -> Self {
        Self(val)
    }

    /// Shortcut for `val.try_into().unwrap()`.
    ///
    /// # Panics
    ///
    /// Panics if the conversion fails.
    #[inline]
    #[track_caller]
    pub fn unchecked_from<T>(val: T) -> Self
    where
        T: TryInto<Self>,
        <T as TryInto<Self>>::Error: fmt::Debug,
    {
        val.try_into().unwrap()
    }

    /// Construct a new [`Signed`] from the value.
    ///
    /// # Panics
    ///
    /// Panics if the conversion fails, for example if the value is too large
    /// for the bit-size of the [`Signed`]. The panic will be attributed to the
    /// call site.
    #[inline]
    #[track_caller]
    pub fn from<T>(value: T) -> Self
    where
        Self: UintTryFrom<T>,
    {
        match Self::uint_try_from(value) {
            Ok(n) => n,
            Err(e) => panic!("Uint conversion error: {e}"),
        }
    }

    /// # Panics
    ///
    /// Panics if the conversion fails, for example if the value is too large
    /// for the bit-size of the target type.
    #[inline]
    #[track_caller]
    pub fn to<T>(&self) -> T
    where
        Self: UintTryTo<T>,
        T: fmt::Debug,
    {
        self.uint_try_to().expect("Uint conversion error")
    }

    /// Shortcut for `self.try_into().unwrap()`.
    ///
    /// # Panics
    ///
    /// Panics if the conversion fails.
    #[inline]
    #[track_caller]
    pub fn unchecked_into<T>(self) -> T
    where
        Self: TryInto<T>,
        <Self as TryInto<T>>::Error: fmt::Debug,
    {
        self.try_into().unwrap()
    }

    /// Returns the signed integer as a unsigned integer. If the value of `self`
    /// negative, then the two's complement of its absolute value will be
    /// returned.
    #[inline]
    pub const fn into_raw(self) -> Uint<BITS, LIMBS> {
        self.0
    }

    /// Returns the sign of self.
    #[inline]
    pub const fn sign(&self) -> Sign {
        // if the last limb contains the sign bit, then we're negative
        // because we can't set any higher bits to 1, we use >= as a proxy
        // check to avoid bit comparison
        if let Some(limb) = self.0.as_limbs().last() {
            if *limb >= Self::SIGN_BIT {
                return Sign::Negative;
            }
        }
        Sign::Positive
    }

    /// Determines if the integer is odd.
    #[inline]
    pub const fn is_odd(&self) -> bool {
        if BITS == 0 {
            false
        } else {
            self.as_limbs()[0] % 2 == 1
        }
    }

    /// Compile-time equality. NOT constant-time equality.
    #[inline]
    pub const fn const_eq(&self, other: &Self) -> bool {
        const_eq(self, other)
    }

    /// Returns `true` if `self` is zero and `false` if the number is negative
    /// or positive.
    #[inline]
    pub const fn is_zero(&self) -> bool {
        self.const_eq(&Self::ZERO)
    }

    /// Returns `true` if `self` is positive and `false` if the number is zero
    /// or negative.
    #[inline]
    pub const fn is_positive(&self) -> bool {
        !self.is_zero() && matches!(self.sign(), Sign::Positive)
    }

    /// Returns `true` if `self` is negative and `false` if the number is zero
    /// or positive.
    #[inline]
    pub const fn is_negative(&self) -> bool {
        matches!(self.sign(), Sign::Negative)
    }

    /// Returns the number of ones in the binary representation of `self`.
    #[inline]
    pub fn count_ones(&self) -> usize {
        self.0.count_ones()
    }

    /// Returns the number of zeros in the binary representation of `self`.
    #[inline]
    pub fn count_zeros(&self) -> usize {
        self.0.count_zeros()
    }

    /// Returns the number of leading zeros in the binary representation of
    /// `self`.
    #[inline]
    pub fn leading_zeros(&self) -> usize {
        self.0.leading_zeros()
    }

    /// Returns the number of leading zeros in the binary representation of
    /// `self`.
    #[inline]
    pub fn trailing_zeros(&self) -> usize {
        self.0.trailing_zeros()
    }

    /// Returns the number of leading ones in the binary representation of
    /// `self`.
    #[inline]
    pub fn trailing_ones(&self) -> usize {
        self.0.trailing_ones()
    }

    /// Returns whether a specific bit is set.
    ///
    /// Returns `false` if `index` exceeds the bit width of the number.
    #[inline]
    pub const fn bit(&self, index: usize) -> bool {
        self.0.bit(index)
    }

    /// Returns a specific byte. The byte at index `0` is the least significant
    /// byte (little endian).
    ///
    /// # Panics
    ///
    /// Panics if `index` exceeds the byte width of the number.
    #[inline]
    #[track_caller]
    pub const fn byte(&self, index: usize) -> u8 {
        self.0.byte(index)
    }

    /// Return the least number of bits needed to represent the number.
    #[inline]
    pub fn bits(&self) -> u32 {
        let unsigned = self.unsigned_abs();
        let unsigned_bits = unsigned.bit_len();

        // NOTE: We need to deal with two special cases:
        //   - the number is 0
        //   - the number is a negative power of `2`. These numbers are written as `0b11..1100..00`.
        //   In the case of a negative power of two, the number of bits required
        //   to represent the negative signed value is equal to the number of
        //   bits required to represent its absolute value as an unsigned
        //   integer. This is best illustrated by an example: the number of bits
        //   required to represent `-128` is `8` since it is equal to `i8::MIN`
        //   and, therefore, obviously fits in `8` bits. This is equal to the
        //   number of bits required to represent `128` as an unsigned integer
        //   (which fits in a `u8`).  However, the number of bits required to
        //   represent `128` as a signed integer is `9`, as it is greater than
        //   `i8::MAX`.  In the general case, an extra bit is needed to
        //   represent the sign.
        let bits = if self.count_zeros() == self.trailing_zeros() {
            // `self` is zero or a negative power of two
            unsigned_bits
        } else {
            unsigned_bits + 1
        };

        bits as u32
    }

    /// Creates a `Signed` from a sign and an absolute value. Returns the value
    /// and a bool that is true if the conversion caused an overflow.
    #[inline]
    pub fn overflowing_from_sign_and_abs(sign: Sign, abs: Uint<BITS, LIMBS>) -> (Self, bool) {
        let value = Self(match sign {
            Sign::Positive => abs,
            Sign::Negative => twos_complement(abs),
        });

        (value, value.sign() != sign && value != Self::ZERO)
    }

    /// Creates a `Signed` from an absolute value and a negative flag. Returns
    /// `None` if it would overflow as `Signed`.
    #[inline]
    pub fn checked_from_sign_and_abs(sign: Sign, abs: Uint<BITS, LIMBS>) -> Option<Self> {
        let (result, overflow) = Self::overflowing_from_sign_and_abs(sign, abs);
        if overflow {
            None
        } else {
            Some(result)
        }
    }

    /// Convert from a decimal string.
    pub fn from_dec_str(value: &str) -> Result<Self, ParseSignedError> {
        let (sign, value) = match value.as_bytes().first() {
            Some(b'+') => (Sign::Positive, &value[1..]),
            Some(b'-') => (Sign::Negative, &value[1..]),
            _ => (Sign::Positive, value),
        };
        let abs = Uint::<BITS, LIMBS>::from_str_radix(value, 10)?;
        Self::checked_from_sign_and_abs(sign, abs).ok_or(ParseSignedError::IntegerOverflow)
    }

    /// Convert to a decimal string.
    pub fn to_dec_string(&self) -> String {
        let sign = self.sign();
        let abs = self.unsigned_abs();

        format!("{sign}{abs}")
    }

    /// Convert from a hex string.
    pub fn from_hex_str(value: &str) -> Result<Self, ParseSignedError> {
        let (sign, value) = match value.as_bytes().first() {
            Some(b'+') => (Sign::Positive, &value[1..]),
            Some(b'-') => (Sign::Negative, &value[1..]),
            _ => (Sign::Positive, value),
        };

        let value = value.strip_prefix("0x").unwrap_or(value);

        if value.len() > 64 {
            return Err(ParseSignedError::IntegerOverflow);
        }

        let abs = Uint::<BITS, LIMBS>::from_str_radix(value, 16)?;
        Self::checked_from_sign_and_abs(sign, abs).ok_or(ParseSignedError::IntegerOverflow)
    }

    /// Convert to a hex string.
    pub fn to_hex_string(&self) -> String {
        let sign = self.sign();
        let abs = self.unsigned_abs();

        format!("{sign}0x{abs:x}")
    }

    /// Splits a Signed into its absolute value and negative flag.
    #[inline]
    pub fn into_sign_and_abs(&self) -> (Sign, Uint<BITS, LIMBS>) {
        let sign = self.sign();
        let abs = match sign {
            Sign::Positive => self.0,
            Sign::Negative => twos_complement(self.0),
        };
        (sign, abs)
    }

    /// Converts `self` to a big-endian byte array of size exactly
    /// [`Self::BYTES`].
    ///
    /// # Panics
    ///
    /// Panics if the generic parameter `BYTES` is not exactly [`Self::BYTES`].
    /// Ideally this would be a compile time error, but this is blocked by
    /// Rust issue [#60551].
    ///
    /// [#60551]: https://github.com/rust-lang/rust/issues/60551
    #[inline]
    pub const fn to_be_bytes<const BYTES: usize>(&self) -> [u8; BYTES] {
        self.0.to_be_bytes()
    }

    /// Converts `self` to a little-endian byte array of size exactly
    /// [`Self::BYTES`].
    ///
    /// # Panics
    ///
    /// Panics if the generic parameter `BYTES` is not exactly [`Self::BYTES`].
    /// Ideally this would be a compile time error, but this is blocked by
    /// Rust issue [#60551].
    ///
    /// [#60551]: https://github.com/rust-lang/rust/issues/60551
    #[inline]
    pub const fn to_le_bytes<const BYTES: usize>(&self) -> [u8; BYTES] {
        self.0.to_le_bytes()
    }

    /// Converts a big-endian byte array of size exactly [`Self::BYTES`].
    ///
    /// # Panics
    ///
    /// Panics if the generic parameter `BYTES` is not exactly [`Self::BYTES`].
    /// Ideally this would be a compile time error, but this is blocked by
    /// Rust issue [#60551].
    ///
    /// [#60551]: https://github.com/rust-lang/rust/issues/60551
    ///
    /// Panics if the value is too large for the bit-size of the Uint.
    #[inline]
    pub const fn from_be_bytes<const BYTES: usize>(bytes: [u8; BYTES]) -> Self {
        Self(Uint::from_be_bytes::<BYTES>(bytes))
    }

    /// Convert from an array in LE format
    ///
    /// # Panics
    ///
    /// Panics if the given array is not the correct length.
    #[inline]
    #[track_caller]
    pub const fn from_le_bytes<const BYTES: usize>(bytes: [u8; BYTES]) -> Self {
        Self(Uint::from_le_bytes::<BYTES>(bytes))
    }

    /// Creates a new integer from a big endian slice of bytes.
    ///
    /// The slice is interpreted as a big endian number. Leading zeros
    /// are ignored. The slice can be any length.
    ///
    /// Returns [`None`] if the value is larger than fits the [`Uint`].
    pub fn try_from_be_slice(slice: &[u8]) -> Option<Self> {
        Uint::try_from_be_slice(slice).map(Self)
    }

    /// Creates a new integer from a little endian slice of bytes.
    ///
    /// The slice is interpreted as a big endian number. Leading zeros
    /// are ignored. The slice can be any length.
    ///
    /// Returns [`None`] if the value is larger than fits the [`Uint`].
    pub fn try_from_le_slice(slice: &[u8]) -> Option<Self> {
        Uint::try_from_le_slice(slice).map(Self)
    }

    /// View the array of limbs.
    #[inline(always)]
    #[must_use]
    pub const fn as_limbs(&self) -> &[u64; LIMBS] {
        self.0.as_limbs()
    }

    /// Convert to a array of limbs.
    ///
    /// Limbs are least significant first.
    #[inline(always)]
    pub const fn into_limbs(self) -> [u64; LIMBS] {
        self.0.into_limbs()
    }

    /// Construct a new integer from little-endian a array of limbs.
    ///
    /// # Panics
    ///
    /// Panics if `LIMBS` is not equal to `nlimbs(BITS)`.
    ///
    /// Panics if the value is to large for the bit-size of the Uint.
    #[inline(always)]
    #[track_caller]
    #[must_use]
    pub const fn from_limbs(limbs: [u64; LIMBS]) -> Self {
        Self(Uint::from_limbs(limbs))
    }

    /// Constructs the [`Signed`] from digits in the base `base` in big-endian.
    /// Wrapper around ruint's from_base_be
    ///
    /// # Errors
    ///
    /// * [`BaseConvertError::InvalidBase`] if the base is less than 2.
    /// * [`BaseConvertError::InvalidDigit`] if a digit is out of range.
    /// * [`BaseConvertError::Overflow`] if the number is too large to fit.
    pub fn from_base_be<I: IntoIterator<Item = u64>>(
        base: u64,
        digits: I,
    ) -> Result<Self, BaseConvertError> {
        Ok(Self(Uint::from_base_be(base, digits)?))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{aliases::*, BigIntConversionError, ParseSignedError};
    use alloc::string::ToString;
    use core::ops::Neg;
    use ruint::{
        aliases::{U0, U1, U128, U160, U256},
        BaseConvertError, ParseError,
    };

    // type U2 = Uint<2, 1>;
    type I96 = Signed<96, 2>;
    type U96 = Uint<96, 2>;

    #[test]
    fn identities() {
        macro_rules! test_identities {
            ($signed:ty, $max:literal, $min:literal) => {
                assert_eq!(<$signed>::ZERO.to_string(), "0");
                assert_eq!(<$signed>::ONE.to_string(), "1");
                assert_eq!(<$signed>::MINUS_ONE.to_string(), "-1");
                assert_eq!(<$signed>::MAX.to_string(), $max);
                assert_eq!(<$signed>::MIN.to_string(), $min);
            };
        }

        assert_eq!(I0::ZERO.to_string(), "0");
        assert_eq!(I1::ZERO.to_string(), "0");
        assert_eq!(I1::ONE.to_string(), "-1");

        test_identities!(I96, "39614081257132168796771975167", "-39614081257132168796771975168");
        test_identities!(
            I128,
            "170141183460469231731687303715884105727",
            "-170141183460469231731687303715884105728"
        );
        test_identities!(
            I192,
            "3138550867693340381917894711603833208051177722232017256447",
            "-3138550867693340381917894711603833208051177722232017256448"
        );
        test_identities!(
            I256,
            "57896044618658097711785492504343953926634992332820282019728792003956564819967",
            "-57896044618658097711785492504343953926634992332820282019728792003956564819968"
        );
    }

    #[test]
    fn std_num_conversion() {
        // test conversion from basic types

        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty, $i:ty, $u:ty) => {
                // Test a specific number
                assert_eq!(<$i_struct>::try_from(-42 as $i).unwrap().to_string(), "-42");
                assert_eq!(<$i_struct>::try_from(42 as $i).unwrap().to_string(), "42");
                assert_eq!(<$i_struct>::try_from(42 as $u).unwrap().to_string(), "42");

                if <$u_struct>::BITS as u32 >= <$u>::BITS {
                    assert_eq!(
                        <$i_struct>::try_from(<$i>::MAX).unwrap().to_string(),
                        <$i>::MAX.to_string(),
                    );
                    assert_eq!(
                        <$i_struct>::try_from(<$i>::MIN).unwrap().to_string(),
                        <$i>::MIN.to_string(),
                    );
                } else {
                    assert_eq!(
                        <$i_struct>::try_from(<$i>::MAX).unwrap_err(),
                        BigIntConversionError,
                    );
                }
            };

            ($i_struct:ty, $u_struct:ty) => {
                run_test!($i_struct, $u_struct, i8, u8);
                run_test!($i_struct, $u_struct, i16, u16);
                run_test!($i_struct, $u_struct, i32, u32);
                run_test!($i_struct, $u_struct, i64, u64);
                run_test!($i_struct, $u_struct, i128, u128);
                run_test!($i_struct, $u_struct, isize, usize);
            };
        }

        // edge cases
        assert_eq!(I0::unchecked_from(0), I0::default());
        assert_eq!(I0::try_from(1u8), Err(BigIntConversionError));
        assert_eq!(I0::try_from(1i8), Err(BigIntConversionError));
        assert_eq!(I1::unchecked_from(0), I1::default());
        assert_eq!(I1::try_from(1u8), Err(BigIntConversionError));
        assert_eq!(I1::try_from(1i8), Err(BigIntConversionError));
        assert_eq!(I1::try_from(-1), Ok(I1::MINUS_ONE));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn from_dec_str() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let min_abs: $u_struct = <$i_struct>::MIN.0;
                let unsigned = <$u_struct>::from_str_radix("3141592653589793", 10).unwrap();

                let value = <$i_struct>::from_dec_str(&format!("-{unsigned}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Negative, unsigned));

                let value = <$i_struct>::from_dec_str(&format!("{unsigned}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Positive, unsigned));

                let value = <$i_struct>::from_dec_str(&format!("+{unsigned}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Positive, unsigned));

                let err = <$i_struct>::from_dec_str("invalid string").unwrap_err();
                assert_eq!(
                    err,
                    ParseSignedError::Ruint(ParseError::BaseConvertError(
                        BaseConvertError::InvalidDigit(18, 10)
                    ))
                );

                let err = <$i_struct>::from_dec_str(&format!("1{}", <$u_struct>::MAX)).unwrap_err();
                assert_eq!(err, ParseSignedError::IntegerOverflow);

                let err = <$i_struct>::from_dec_str(&format!("-{}", <$u_struct>::MAX)).unwrap_err();
                assert_eq!(err, ParseSignedError::IntegerOverflow);

                let value = <$i_struct>::from_dec_str(&format!("-{}", min_abs)).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Negative, min_abs));

                let err = <$i_struct>::from_dec_str(&format!("{}", min_abs)).unwrap_err();
                assert_eq!(err, ParseSignedError::IntegerOverflow);
            };
        }

        assert_eq!(I0::from_dec_str("0"), Ok(I0::default()));
        assert_eq!(I1::from_dec_str("0"), Ok(I1::ZERO));
        assert_eq!(I1::from_dec_str("-1"), Ok(I1::MINUS_ONE));
        assert_eq!(I1::from_dec_str("1"), Err(ParseSignedError::IntegerOverflow));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn from_hex_str() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let min_abs = <$i_struct>::MIN.0;
                let unsigned = <$u_struct>::from_str_radix("3141592653589793", 10).unwrap();

                let value = <$i_struct>::from_hex_str(&format!("-{unsigned:x}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Negative, unsigned));

                let value = <$i_struct>::from_hex_str(&format!("-0x{unsigned:x}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Negative, unsigned));

                let value = <$i_struct>::from_hex_str(&format!("{unsigned:x}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Positive, unsigned));

                let value = <$i_struct>::from_hex_str(&format!("0x{unsigned:x}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Positive, unsigned));

                let value = <$i_struct>::from_hex_str(&format!("+0x{unsigned:x}")).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Positive, unsigned));

                let err = <$i_struct>::from_hex_str("invalid string").unwrap_err();
                assert!(matches!(err, ParseSignedError::Ruint(_)));

                let err =
                    <$i_struct>::from_hex_str(&format!("1{:x}", <$u_struct>::MAX)).unwrap_err();
                assert!(matches!(err, ParseSignedError::IntegerOverflow));

                let err =
                    <$i_struct>::from_hex_str(&format!("-{:x}", <$u_struct>::MAX)).unwrap_err();
                assert!(matches!(err, ParseSignedError::IntegerOverflow));

                let value = <$i_struct>::from_hex_str(&format!("-{:x}", min_abs)).unwrap();
                assert_eq!(value.into_sign_and_abs(), (Sign::Negative, min_abs));

                let err = <$i_struct>::from_hex_str(&format!("{:x}", min_abs)).unwrap_err();
                assert!(matches!(err, ParseSignedError::IntegerOverflow));
            };
        }

        assert_eq!(I0::from_hex_str("0x0"), Ok(I0::default()));
        assert_eq!(I1::from_hex_str("0x0"), Ok(I1::ZERO));
        assert_eq!(I1::from_hex_str("0x0"), Ok(I1::ZERO));
        assert_eq!(I1::from_hex_str("-0x1"), Ok(I1::MINUS_ONE));
        assert_eq!(I1::from_hex_str("0x1"), Err(ParseSignedError::IntegerOverflow));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn parse() {
        assert_eq!("0x0".parse::<I0>(), Ok(I0::default()));
        assert_eq!("+0x0".parse::<I0>(), Ok(I0::default()));
        assert_eq!("0x0".parse::<I1>(), Ok(I1::ZERO));
        assert_eq!("+0x0".parse::<I1>(), Ok(I1::ZERO));
        assert_eq!("-0x1".parse::<I1>(), Ok(I1::MINUS_ONE));
        assert_eq!("0x1".parse::<I1>(), Err(ParseSignedError::IntegerOverflow));

        assert_eq!("0".parse::<I0>(), Ok(I0::default()));
        assert_eq!("+0".parse::<I0>(), Ok(I0::default()));
        assert_eq!("0".parse::<I1>(), Ok(I1::ZERO));
        assert_eq!("+0".parse::<I1>(), Ok(I1::ZERO));
        assert_eq!("-1".parse::<I1>(), Ok(I1::MINUS_ONE));
        assert_eq!("1".parse::<I1>(), Err(ParseSignedError::IntegerOverflow));
    }

    #[test]
    fn formatting() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let unsigned = <$u_struct>::from_str_radix("3141592653589793", 10).unwrap();
                let unsigned_negative = -unsigned;
                let positive = <$i_struct>::try_from(unsigned).unwrap();
                let negative = -positive;

                assert_eq!(format!("{positive}"), format!("{unsigned}"));
                assert_eq!(format!("{negative}"), format!("-{unsigned}"));
                assert_eq!(format!("{positive:+}"), format!("+{unsigned}"));
                assert_eq!(format!("{negative:+}"), format!("-{unsigned}"));

                assert_eq!(format!("{positive:x}"), format!("{unsigned:x}"));
                assert_eq!(format!("{negative:x}"), format!("{unsigned_negative:x}"));
                assert_eq!(format!("{positive:+x}"), format!("+{unsigned:x}"));
                assert_eq!(format!("{negative:+x}"), format!("+{unsigned_negative:x}"));

                assert_eq!(format!("{positive:X}"), format!("{unsigned:X}"));
                assert_eq!(format!("{negative:X}"), format!("{unsigned_negative:X}"));
                assert_eq!(format!("{positive:+X}"), format!("+{unsigned:X}"));
                assert_eq!(format!("{negative:+X}"), format!("+{unsigned_negative:X}"));
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(format!("{z} {o} {m}"), "0 0 -1");

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn signs() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(<$i_struct>::MAX.sign(), Sign::Positive);
                assert!(<$i_struct>::MAX.is_positive());
                assert!(!<$i_struct>::MAX.is_negative());
                assert!(!<$i_struct>::MAX.is_zero());

                assert_eq!(<$i_struct>::ONE.sign(), Sign::Positive);
                assert!(<$i_struct>::ONE.is_positive());
                assert!(!<$i_struct>::ONE.is_negative());
                assert!(!<$i_struct>::ONE.is_zero());

                assert_eq!(<$i_struct>::MIN.sign(), Sign::Negative);
                assert!(!<$i_struct>::MIN.is_positive());
                assert!(<$i_struct>::MIN.is_negative());
                assert!(!<$i_struct>::MIN.is_zero());

                assert_eq!(<$i_struct>::MINUS_ONE.sign(), Sign::Negative);
                assert!(!<$i_struct>::MINUS_ONE.is_positive());
                assert!(<$i_struct>::MINUS_ONE.is_negative());
                assert!(!<$i_struct>::MINUS_ONE.is_zero());

                assert_eq!(<$i_struct>::ZERO.sign(), Sign::Positive);
                assert!(!<$i_struct>::ZERO.is_positive());
                assert!(!<$i_struct>::ZERO.is_negative());
                assert!(<$i_struct>::ZERO.is_zero());
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.sign(), Sign::Positive);
        assert_eq!(o.sign(), Sign::Positive);
        assert_eq!(m.sign(), Sign::Negative);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn abs() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let positive = <$i_struct>::from_dec_str("3141592653589793").unwrap();
                let negative = <$i_struct>::from_dec_str("-27182818284590").unwrap();

                assert_eq!(positive.sign(), Sign::Positive);
                assert_eq!(positive.abs().sign(), Sign::Positive);
                assert_eq!(positive, positive.abs());
                assert_ne!(negative, negative.abs());
                assert_eq!(negative.sign(), Sign::Negative);
                assert_eq!(negative.abs().sign(), Sign::Positive);
                assert_eq!(<$i_struct>::ZERO.abs(), <$i_struct>::ZERO);
                assert_eq!(<$i_struct>::MAX.abs(), <$i_struct>::MAX);
                assert_eq!((-<$i_struct>::MAX).abs(), <$i_struct>::MAX);
                assert_eq!(<$i_struct>::MIN.checked_abs(), None);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.abs(), z);
        assert_eq!(o.abs(), o);
        assert_eq!(m.checked_abs(), None);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn neg() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let positive = <$i_struct>::from_dec_str("3141592653589793").unwrap().sign();
                let negative = -positive;

                assert_eq!(-positive, negative);
                assert_eq!(-negative, positive);

                assert_eq!(-<$i_struct>::ZERO, <$i_struct>::ZERO);
                assert_eq!(-(-<$i_struct>::MAX), <$i_struct>::MAX);
                assert_eq!(<$i_struct>::MIN.checked_neg(), None);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(-z, z);
        assert_eq!(-o, o);
        assert_eq!(m.checked_neg(), None);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn bits() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(<$i_struct>::try_from(0b1000).unwrap().bits(), 5);
                assert_eq!(<$i_struct>::try_from(-0b1000).unwrap().bits(), 4);

                assert_eq!(<$i_struct>::try_from(i64::MAX).unwrap().bits(), 64);
                assert_eq!(<$i_struct>::try_from(i64::MIN).unwrap().bits(), 64);

                assert_eq!(<$i_struct>::MAX.bits(), <$i_struct>::BITS as u32);
                assert_eq!(<$i_struct>::MIN.bits(), <$i_struct>::BITS as u32);

                assert_eq!(<$i_struct>::ZERO.bits(), 0);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.bits(), 0);
        assert_eq!(o.bits(), 0);
        assert_eq!(m.bits(), 1);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn bit_shift() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(<$i_struct>::ONE << <$i_struct>::BITS - 1, <$i_struct>::MIN);
                assert_eq!(<$i_struct>::MIN >> <$i_struct>::BITS - 1, <$i_struct>::ONE);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z << 1, z >> 1);
        assert_eq!(o << 1, o >> 0);
        assert_eq!(m << 1, o);
        assert_eq!(m >> 1, o);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn arithmetic_shift_right() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let exp = <$i_struct>::BITS - 2;
                let shift = <$i_struct>::BITS - 3;

                let value =
                    <$i_struct>::from_raw(<$u_struct>::from(2u8).pow(<$u_struct>::from(exp))).neg();

                let expected_result =
                    <$i_struct>::from_raw(<$u_struct>::MAX - <$u_struct>::from(1u8));
                assert_eq!(
                    value.asr(shift),
                    expected_result,
                    "1011...1111 >> 253 was not 1111...1110"
                );

                let value = <$i_struct>::MINUS_ONE;
                let expected_result = <$i_struct>::MINUS_ONE;
                assert_eq!(value.asr(250), expected_result, "-1 >> any_amount was not -1");

                let value = <$i_struct>::from_raw(
                    <$u_struct>::from(2u8).pow(<$u_struct>::from(<$i_struct>::BITS - 2)),
                )
                .neg();
                let expected_result = <$i_struct>::MINUS_ONE;
                assert_eq!(
                    value.asr(<$i_struct>::BITS - 1),
                    expected_result,
                    "1011...1111 >> 255 was not -1"
                );

                let value = <$i_struct>::from_raw(
                    <$u_struct>::from(2u8).pow(<$u_struct>::from(<$i_struct>::BITS - 2)),
                )
                .neg();
                let expected_result = <$i_struct>::MINUS_ONE;
                assert_eq!(value.asr(1024), expected_result, "1011...1111 >> 1024 was not -1");

                let value = <$i_struct>::try_from(1024i32).unwrap();
                let expected_result = <$i_struct>::try_from(32i32).unwrap();
                assert_eq!(value.asr(5), expected_result, "1024 >> 5 was not 32");

                let value = <$i_struct>::MAX;
                let expected_result = <$i_struct>::ZERO;
                assert_eq!(value.asr(255), expected_result, "<$i_struct>::MAX >> 255 was not 0");

                let value =
                    <$i_struct>::from_raw(<$u_struct>::from(2u8).pow(<$u_struct>::from(exp))).neg();
                let expected_result = value;
                assert_eq!(value.asr(0), expected_result, "1011...1111 >> 0 was not 1011...111");
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.asr(1), z);
        assert_eq!(o.asr(1), o);
        assert_eq!(m.asr(1), m);
        assert_eq!(m.asr(1000), m);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn arithmetic_shift_left() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let value = <$i_struct>::MINUS_ONE;
                let expected_result = Some(value);
                assert_eq!(value.asl(0), expected_result, "-1 << 0 was not -1");

                let value = <$i_struct>::MINUS_ONE;
                let expected_result = None;
                assert_eq!(
                    value.asl(256),
                    expected_result,
                    "-1 << 256 did not overflow (result should be 0000...0000)"
                );

                let value = <$i_struct>::MINUS_ONE;
                let expected_result = Some(<$i_struct>::from_raw(
                    <$u_struct>::from(2u8).pow(<$u_struct>::from(<$i_struct>::BITS - 1)),
                ));
                assert_eq!(
                    value.asl(<$i_struct>::BITS - 1),
                    expected_result,
                    "-1 << 255 was not 1000...0000"
                );

                let value = <$i_struct>::try_from(-1024i32).unwrap();
                let expected_result = Some(<$i_struct>::try_from(-32768i32).unwrap());
                assert_eq!(value.asl(5), expected_result, "-1024 << 5 was not -32768");

                let value = <$i_struct>::try_from(1024i32).unwrap();
                let expected_result = Some(<$i_struct>::try_from(32768i32).unwrap());
                assert_eq!(value.asl(5), expected_result, "1024 << 5 was not 32768");

                let value = <$i_struct>::try_from(1024i32).unwrap();
                let expected_result = None;
                assert_eq!(
                    value.asl(<$i_struct>::BITS - 11),
                    expected_result,
                    "1024 << 245 did not overflow (result should be 1000...0000)"
                );

                let value = <$i_struct>::ZERO;
                let expected_result = Some(value);
                assert_eq!(value.asl(1024), expected_result, "0 << anything was not 0");
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.asl(1), Some(z));
        assert_eq!(o.asl(1), Some(o));
        assert_eq!(m.asl(1), None);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn addition() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(
                    <$i_struct>::MIN.overflowing_add(<$i_struct>::MIN),
                    (<$i_struct>::ZERO, true)
                );
                assert_eq!(
                    <$i_struct>::MAX.overflowing_add(<$i_struct>::MAX),
                    (<$i_struct>::try_from(-2).unwrap(), true)
                );

                assert_eq!(
                    <$i_struct>::MIN.overflowing_add(<$i_struct>::MINUS_ONE),
                    (<$i_struct>::MAX, true)
                );
                assert_eq!(
                    <$i_struct>::MAX.overflowing_add(<$i_struct>::ONE),
                    (<$i_struct>::MIN, true)
                );

                assert_eq!(<$i_struct>::MAX + <$i_struct>::MIN, <$i_struct>::MINUS_ONE);
                assert_eq!(
                    <$i_struct>::try_from(2).unwrap() + <$i_struct>::try_from(40).unwrap(),
                    <$i_struct>::try_from(42).unwrap()
                );

                assert_eq!(<$i_struct>::ZERO + <$i_struct>::ZERO, <$i_struct>::ZERO);

                assert_eq!(<$i_struct>::MAX.saturating_add(<$i_struct>::MAX), <$i_struct>::MAX);
                assert_eq!(
                    <$i_struct>::MIN.saturating_add(<$i_struct>::MINUS_ONE),
                    <$i_struct>::MIN
                );
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z + z, z);
        assert_eq!(o + o, o);
        assert_eq!(m + o, m);
        assert_eq!(m.overflowing_add(m), (o, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn subtraction() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(
                    <$i_struct>::MIN.overflowing_sub(<$i_struct>::MAX),
                    (<$i_struct>::ONE, true)
                );
                assert_eq!(
                    <$i_struct>::MAX.overflowing_sub(<$i_struct>::MIN),
                    (<$i_struct>::MINUS_ONE, true)
                );

                assert_eq!(
                    <$i_struct>::MIN.overflowing_sub(<$i_struct>::ONE),
                    (<$i_struct>::MAX, true)
                );
                assert_eq!(
                    <$i_struct>::MAX.overflowing_sub(<$i_struct>::MINUS_ONE),
                    (<$i_struct>::MIN, true)
                );

                assert_eq!(
                    <$i_struct>::ZERO.overflowing_sub(<$i_struct>::MIN),
                    (<$i_struct>::MIN, true)
                );

                assert_eq!(<$i_struct>::MAX - <$i_struct>::MAX, <$i_struct>::ZERO);
                assert_eq!(
                    <$i_struct>::try_from(2).unwrap() - <$i_struct>::try_from(44).unwrap(),
                    <$i_struct>::try_from(-42).unwrap()
                );

                assert_eq!(<$i_struct>::ZERO - <$i_struct>::ZERO, <$i_struct>::ZERO);

                assert_eq!(<$i_struct>::MAX.saturating_sub(<$i_struct>::MIN), <$i_struct>::MAX);
                assert_eq!(<$i_struct>::MIN.saturating_sub(<$i_struct>::ONE), <$i_struct>::MIN);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z - z, z);
        assert_eq!(o - o, o);
        assert_eq!(m - o, m);
        assert_eq!(m - m, o);
        assert_eq!(o.overflowing_sub(m), (m, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn multiplication() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(
                    <$i_struct>::MIN.overflowing_mul(<$i_struct>::MAX),
                    (<$i_struct>::MIN, true)
                );
                assert_eq!(
                    <$i_struct>::MAX.overflowing_mul(<$i_struct>::MIN),
                    (<$i_struct>::MIN, true)
                );

                assert_eq!(<$i_struct>::MIN * <$i_struct>::ONE, <$i_struct>::MIN);
                assert_eq!(
                    <$i_struct>::try_from(2).unwrap() * <$i_struct>::try_from(-21).unwrap(),
                    <$i_struct>::try_from(-42).unwrap()
                );

                assert_eq!(<$i_struct>::MAX.saturating_mul(<$i_struct>::MAX), <$i_struct>::MAX);
                assert_eq!(
                    <$i_struct>::MAX.saturating_mul(<$i_struct>::try_from(2).unwrap()),
                    <$i_struct>::MAX
                );
                assert_eq!(
                    <$i_struct>::MIN.saturating_mul(<$i_struct>::try_from(-2).unwrap()),
                    <$i_struct>::MAX
                );

                assert_eq!(<$i_struct>::MIN.saturating_mul(<$i_struct>::MAX), <$i_struct>::MIN);
                assert_eq!(
                    <$i_struct>::MIN.saturating_mul(<$i_struct>::try_from(2).unwrap()),
                    <$i_struct>::MIN
                );
                assert_eq!(
                    <$i_struct>::MAX.saturating_mul(<$i_struct>::try_from(-2).unwrap()),
                    <$i_struct>::MIN
                );

                assert_eq!(<$i_struct>::ZERO * <$i_struct>::ZERO, <$i_struct>::ZERO);
                assert_eq!(<$i_struct>::ONE * <$i_struct>::ZERO, <$i_struct>::ZERO);
                assert_eq!(<$i_struct>::MAX * <$i_struct>::ZERO, <$i_struct>::ZERO);
                assert_eq!(<$i_struct>::MIN * <$i_struct>::ZERO, <$i_struct>::ZERO);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z * z, z);
        assert_eq!(o * o, o);
        assert_eq!(m * o, o);
        assert_eq!(m.overflowing_mul(m), (m, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn division() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                // The only case for overflow.
                assert_eq!(
                    <$i_struct>::MIN.overflowing_div(<$i_struct>::try_from(-1).unwrap()),
                    (<$i_struct>::MIN, true)
                );

                assert_eq!(<$i_struct>::MIN / <$i_struct>::MAX, <$i_struct>::try_from(-1).unwrap());
                assert_eq!(<$i_struct>::MAX / <$i_struct>::MIN, <$i_struct>::ZERO);

                assert_eq!(<$i_struct>::MIN / <$i_struct>::ONE, <$i_struct>::MIN);
                assert_eq!(
                    <$i_struct>::try_from(-42).unwrap() / <$i_struct>::try_from(-21).unwrap(),
                    <$i_struct>::try_from(2).unwrap()
                );
                assert_eq!(
                    <$i_struct>::try_from(-42).unwrap() / <$i_struct>::try_from(2).unwrap(),
                    <$i_struct>::try_from(-21).unwrap()
                );
                assert_eq!(
                    <$i_struct>::try_from(42).unwrap() / <$i_struct>::try_from(-21).unwrap(),
                    <$i_struct>::try_from(-2).unwrap()
                );
                assert_eq!(
                    <$i_struct>::try_from(42).unwrap() / <$i_struct>::try_from(21).unwrap(),
                    <$i_struct>::try_from(2).unwrap()
                );

                // The only saturating corner case.
                assert_eq!(
                    <$i_struct>::MIN.saturating_div(<$i_struct>::try_from(-1).unwrap()),
                    <$i_struct>::MAX
                );
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.checked_div(z), None);
        assert_eq!(o.checked_div(o), None);
        assert_eq!(m.checked_div(o), None);
        assert_eq!(m.overflowing_div(m), (m, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    #[cfg(feature = "std")]
    fn division_by_zero() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let err = std::panic::catch_unwind(|| {
                    let _ = <$i_struct>::ONE / <$i_struct>::ZERO;
                });
                assert!(err.is_err());
            };
        }

        run_test!(I0, U0);
        run_test!(I1, U1);
        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn div_euclid() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let a = <$i_struct>::try_from(7).unwrap();
                let b = <$i_struct>::try_from(4).unwrap();

                assert_eq!(a.div_euclid(b), <$i_struct>::ONE); // 7 >= 4 * 1
                assert_eq!(a.div_euclid(-b), <$i_struct>::MINUS_ONE); // 7 >= -4 * -1
                assert_eq!((-a).div_euclid(b), -<$i_struct>::try_from(2).unwrap()); // -7 >= 4 * -2
                assert_eq!((-a).div_euclid(-b), <$i_struct>::try_from(2).unwrap()); // -7 >= -4 * 2

                // Overflowing
                assert_eq!(
                    <$i_struct>::MIN.overflowing_div_euclid(<$i_struct>::MINUS_ONE),
                    (<$i_struct>::MIN, true)
                );
                // Wrapping
                assert_eq!(
                    <$i_struct>::MIN.wrapping_div_euclid(<$i_struct>::MINUS_ONE),
                    <$i_struct>::MIN
                );
                // // Checked
                assert_eq!(<$i_struct>::MIN.checked_div_euclid(<$i_struct>::MINUS_ONE), None);
                assert_eq!(<$i_struct>::ONE.checked_div_euclid(<$i_struct>::ZERO), None);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.checked_div_euclid(z), None);
        assert_eq!(o.checked_div_euclid(o), None);
        assert_eq!(m.checked_div_euclid(o), None);
        assert_eq!(m.overflowing_div_euclid(m), (m, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn rem_euclid() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let a = <$i_struct>::try_from(7).unwrap(); // or any other integer type
                let b = <$i_struct>::try_from(4).unwrap();

                assert_eq!(a.rem_euclid(b), <$i_struct>::try_from(3).unwrap());
                assert_eq!((-a).rem_euclid(b), <$i_struct>::ONE);
                assert_eq!(a.rem_euclid(-b), <$i_struct>::try_from(3).unwrap());
                assert_eq!((-a).rem_euclid(-b), <$i_struct>::ONE);

                // Overflowing
                assert_eq!(a.overflowing_rem_euclid(b), (<$i_struct>::try_from(3).unwrap(), false));
                assert_eq!(
                    <$i_struct>::MIN.overflowing_rem_euclid(<$i_struct>::MINUS_ONE),
                    (<$i_struct>::ZERO, true)
                );

                // Wrapping
                assert_eq!(
                    <$i_struct>::try_from(100)
                        .unwrap()
                        .wrapping_rem_euclid(<$i_struct>::try_from(10).unwrap()),
                    <$i_struct>::ZERO
                );
                assert_eq!(
                    <$i_struct>::MIN.wrapping_rem_euclid(<$i_struct>::MINUS_ONE),
                    <$i_struct>::ZERO
                );

                // Checked
                assert_eq!(a.checked_rem_euclid(b), Some(<$i_struct>::try_from(3).unwrap()));
                assert_eq!(a.checked_rem_euclid(<$i_struct>::ZERO), None);
                assert_eq!(<$i_struct>::MIN.checked_rem_euclid(<$i_struct>::MINUS_ONE), None);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.checked_rem_euclid(z), None);
        assert_eq!(o.checked_rem_euclid(o), None);
        assert_eq!(m.checked_rem_euclid(o), None);
        assert_eq!(m.overflowing_rem_euclid(m), (o, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    #[cfg(feature = "std")]
    fn div_euclid_by_zero() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let err = std::panic::catch_unwind(|| {
                    let _ = <$i_struct>::ONE.div_euclid(<$i_struct>::ZERO);
                });
                assert!(err.is_err());

                let err = std::panic::catch_unwind(|| {
                    assert_eq!(
                        <$i_struct>::MIN.div_euclid(<$i_struct>::MINUS_ONE),
                        <$i_struct>::MAX
                    );
                });
                assert!(err.is_err());
            };
        }

        run_test!(I0, U0);
        run_test!(I1, U1);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    #[cfg(feature = "std")]
    fn div_euclid_overflow() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let err = std::panic::catch_unwind(|| {
                    let _ = <$i_struct>::MIN.div_euclid(<$i_struct>::MINUS_ONE);
                });
                assert!(err.is_err());
            };
        }
        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    #[cfg(feature = "std")]
    fn mod_by_zero() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                let err = std::panic::catch_unwind(|| {
                    let _ = <$i_struct>::ONE % <$i_struct>::ZERO;
                });
                assert!(err.is_err());
            };
        }

        run_test!(I0, U0);
        run_test!(I1, U1);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn remainder() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                // The only case for overflow.
                assert_eq!(
                    <$i_struct>::MIN.overflowing_rem(<$i_struct>::try_from(-1).unwrap()),
                    (<$i_struct>::ZERO, true)
                );
                assert_eq!(
                    <$i_struct>::try_from(-5).unwrap() % <$i_struct>::try_from(-2).unwrap(),
                    <$i_struct>::try_from(-1).unwrap()
                );
                assert_eq!(
                    <$i_struct>::try_from(5).unwrap() % <$i_struct>::try_from(-2).unwrap(),
                    <$i_struct>::ONE
                );
                assert_eq!(
                    <$i_struct>::try_from(-5).unwrap() % <$i_struct>::try_from(2).unwrap(),
                    <$i_struct>::try_from(-1).unwrap()
                );
                assert_eq!(
                    <$i_struct>::try_from(5).unwrap() % <$i_struct>::try_from(2).unwrap(),
                    <$i_struct>::ONE
                );

                assert_eq!(<$i_struct>::MIN.checked_rem(<$i_struct>::try_from(-1).unwrap()), None);
                assert_eq!(<$i_struct>::ONE.checked_rem(<$i_struct>::ONE), Some(<$i_struct>::ZERO));
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.checked_rem(z), None);
        assert_eq!(o.checked_rem(o), None);
        assert_eq!(m.checked_rem(o), None);
        assert_eq!(m.overflowing_rem(m), (o, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn exponentiation() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(
                    <$i_struct>::unchecked_from(1000).saturating_pow(<$u_struct>::from(1000)),
                    <$i_struct>::MAX
                );
                assert_eq!(
                    <$i_struct>::unchecked_from(-1000).saturating_pow(<$u_struct>::from(1001)),
                    <$i_struct>::MIN
                );

                assert_eq!(
                    <$i_struct>::unchecked_from(2).pow(<$u_struct>::from(64)),
                    <$i_struct>::unchecked_from(1u128 << 64)
                );
                assert_eq!(
                    <$i_struct>::unchecked_from(-2).pow(<$u_struct>::from(63)),
                    <$i_struct>::unchecked_from(i64::MIN)
                );

                assert_eq!(<$i_struct>::ZERO.pow(<$u_struct>::from(42)), <$i_struct>::ZERO);
                assert_eq!(<$i_struct>::exp10(18).to_string(), "1000000000000000000");
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.pow(U0::default()), z);
        assert_eq!(o.overflowing_pow(U1::default()), (m, true));
        assert_eq!(o.overflowing_pow(U1::from(1u8)), (o, false));
        assert_eq!(m.overflowing_pow(U1::from(1u8)), (m, false));
        assert_eq!(m.overflowing_pow(U1::default()), (m, true));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn iterators() {
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_eq!(
                    (1..=5).map(<$i_struct>::try_from).map(Result::unwrap).sum::<$i_struct>(),
                    <$i_struct>::try_from(15).unwrap()
                );
                assert_eq!(
                    (1..=5).map(<$i_struct>::try_from).map(Result::unwrap).product::<$i_struct>(),
                    <$i_struct>::try_from(120).unwrap()
                );
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!([z; 0].into_iter().sum::<I0>(), z);
        assert_eq!([o; 1].into_iter().sum::<I1>(), o);
        assert_eq!([m; 1].into_iter().sum::<I1>(), m);

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn twos_complement() {
        macro_rules! assert_twos_complement {
            ($i_struct:ty, $u_struct:ty, $signed:ty, $unsigned:ty) => {
                if <$u_struct>::BITS as u32 >= <$unsigned>::BITS {
                    assert_eq!(
                        <$i_struct>::try_from(<$signed>::MAX).unwrap().twos_complement(),
                        <$u_struct>::try_from(<$signed>::MAX).unwrap()
                    );
                    assert_eq!(
                        <$i_struct>::try_from(<$signed>::MIN).unwrap().twos_complement(),
                        <$u_struct>::try_from(<$signed>::MIN.unsigned_abs()).unwrap()
                    );
                }

                assert_eq!(
                    <$i_struct>::try_from(0 as $signed).unwrap().twos_complement(),
                    <$u_struct>::try_from(0 as $signed).unwrap()
                );

                assert_eq!(
                    <$i_struct>::try_from(0 as $unsigned).unwrap().twos_complement(),
                    <$u_struct>::try_from(0 as $unsigned).unwrap()
                );
            };
        }
        macro_rules! run_test {
            ($i_struct:ty, $u_struct:ty) => {
                assert_twos_complement!($i_struct, $u_struct, i8, u8);
                assert_twos_complement!($i_struct, $u_struct, i16, u16);
                assert_twos_complement!($i_struct, $u_struct, i32, u32);
                assert_twos_complement!($i_struct, $u_struct, i64, u64);
                assert_twos_complement!($i_struct, $u_struct, i128, u128);
                assert_twos_complement!($i_struct, $u_struct, isize, usize);
            };
        }

        let z = I0::default();
        let o = I1::default();
        let m = I1::MINUS_ONE;
        assert_eq!(z.twos_complement(), U0::default());
        assert_eq!(o.twos_complement(), U1::default());
        assert_eq!(m.twos_complement(), U1::from(1));

        run_test!(I96, U96);
        run_test!(I128, U128);
        run_test!(I160, U160);
        run_test!(I192, U192);
        run_test!(I256, U256);
    }

    #[test]
    fn test_overflowing_from_sign_and_abs() {
        let a = Uint::<8, 1>::ZERO;
        let (_, overflow) = Signed::overflowing_from_sign_and_abs(Sign::Negative, a);
        assert!(!overflow);

        let a = Uint::<8, 1>::from(128u8);
        let (_, overflow) = Signed::overflowing_from_sign_and_abs(Sign::Negative, a);
        assert!(!overflow);

        let a = Uint::<8, 1>::from(129u8);
        let (_, overflow) = Signed::overflowing_from_sign_and_abs(Sign::Negative, a);
        assert!(overflow);
    }

    #[test]
    fn test_int_conversion() {
        // can convert between signed of different sizes when value is within bounds
        let m_i256 = I256::unchecked_from(-4);
        let m_i24 = I24::from(m_i256);
        assert_eq!(m_i24, I24::from_dec_str("-4").unwrap());
        let m_i56 = I56::from(m_i24);
        assert_eq!(m_i56, I56::from_dec_str("-4").unwrap());
        let m_i128 = I128::from(m_i56);
        assert_eq!(m_i128, I128::from_dec_str("-4").unwrap());
        let m_i96 = I96::from(m_i128);
        assert_eq!(m_i96, I96::from_dec_str("-4").unwrap());

        // convert positive signed to unsigned
        assert_eq!(U24::from(I24::from_hex_str("0x7FFFFF").unwrap()), U24::from(0x7FFFFF));

        // convert unsigned to positive signed
        assert_eq!(I24::from(U24::from(0x7FFFFF)), I24::from_hex_str("0x7FFFFF").unwrap());
        assert_eq!(I24::from(U96::from(0x7FFFFF)), I24::from_hex_str("0x7FFFFF").unwrap());

        // can't convert negative signed to unsigned
        assert!(U24::uint_try_from(m_i24).is_err());

        // can't convert unsigned to positive signed if too large
        assert!(I24::uint_try_from(U24::from(0x800000)).is_err());

        // out-of-bounds conversions
        assert!(I24::uint_try_from(I128::MIN).is_err());
        assert!(I24::uint_try_from(I128::MAX).is_err());
    }
}
```
```rs [./src/signed/mod.rs]
//! This module contains a 256-bit signed integer implementation.

/// Conversion implementations.
mod conversions;

/// Error types for signed integers.
mod errors;
pub use errors::{BigIntConversionError, ParseSignedError};

/// Signed integer type wrapping a [`ruint::Uint`].
mod int;
pub use int::Signed;

/// Operation implementations.
mod ops;

/// A simple [`Sign`] enum, for dealing with integer signs.
mod sign;
pub use sign::Sign;

/// Serde support.
#[cfg(feature = "serde")]
mod serde;

/// Utility functions used in the signed integer implementation.
pub(crate) mod utils;
```
```rs [./src/signed/errors.rs]
use core::fmt;
use ruint::BaseConvertError;

/// The error type that is returned when parsing a signed integer.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ParseSignedError {
    /// Error that occurs when an invalid digit is encountered while parsing.
    Ruint(ruint::ParseError),

    /// Error that occurs when the number is too large or too small (negative)
    /// and does not fit in the target signed integer.
    IntegerOverflow,
}

impl From<ruint::ParseError> for ParseSignedError {
    fn from(err: ruint::ParseError) -> Self {
        // these errors are redundant, so we coerce the more complex one to the
        // simpler one
        match err {
            ruint::ParseError::BaseConvertError(BaseConvertError::Overflow) => {
                Self::IntegerOverflow
            }
            _ => Self::Ruint(err),
        }
    }
}

impl core::error::Error for ParseSignedError {
    fn source(&self) -> Option<&(dyn core::error::Error + 'static)> {
        match self {
            #[cfg(feature = "std")]
            Self::Ruint(err) => Some(err),
            _ => None,
        }
    }
}

impl fmt::Display for ParseSignedError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Ruint(e) => e.fmt(f),
            Self::IntegerOverflow => f.write_str("number does not fit in the integer size"),
        }
    }
}

/// The error type that is returned when conversion to or from a integer fails.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct BigIntConversionError;

impl core::error::Error for BigIntConversionError {}

impl fmt::Display for BigIntConversionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("output of range integer conversion attempted")
    }
}
```
```rs [./src/signed/sign.rs]
use core::{
    fmt::{self, Write},
    ops,
};

/// Enum to represent the sign of a 256-bit signed integer.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(i8)]
pub enum Sign {
    /// Less than zero.
    Negative = -1,
    /// Greater than or equal to zero.
    Positive = 1,
}

impl ops::Mul for Sign {
    type Output = Self;

    #[inline]
    fn mul(self, rhs: Self) -> Self::Output {
        match (self, rhs) {
            (Self::Positive, Self::Positive) => Self::Positive,
            (Self::Positive, Self::Negative) => Self::Negative,
            (Self::Negative, Self::Positive) => Self::Negative,
            (Self::Negative, Self::Negative) => Self::Positive,
        }
    }
}

impl ops::Neg for Sign {
    type Output = Self;

    #[inline]
    fn neg(self) -> Self::Output {
        match self {
            Self::Positive => Self::Negative,
            Self::Negative => Self::Positive,
        }
    }
}

impl ops::Not for Sign {
    type Output = Self;

    #[inline]
    fn not(self) -> Self::Output {
        match self {
            Self::Positive => Self::Negative,
            Self::Negative => Self::Positive,
        }
    }
}

impl fmt::Display for Sign {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match (self, f.sign_plus()) {
            (Self::Positive, false) => Ok(()),
            _ => f.write_char(self.as_char()),
        }
    }
}

impl Sign {
    /// Equality at compile-time.
    #[inline]
    pub const fn const_eq(self, other: Self) -> bool {
        self as i8 == other as i8
    }

    /// Returns whether the sign is positive.
    #[inline]
    pub const fn is_positive(&self) -> bool {
        matches!(self, Self::Positive)
    }

    /// Returns whether the sign is negative.
    #[inline]
    pub const fn is_negative(&self) -> bool {
        matches!(self, Self::Negative)
    }

    /// Returns the sign character.
    #[inline]
    pub const fn as_char(&self) -> char {
        match self {
            Self::Positive => '+',
            Self::Negative => '-',
        }
    }
}
```
```rs [./src/signed/ops.rs]
use super::{
    utils::{handle_overflow, twos_complement},
    Sign, Signed,
};
use core::{cmp, iter, ops};
use ruint::Uint;

// ops impl
impl<const BITS: usize, const LIMBS: usize> Signed<BITS, LIMBS> {
    /// Computes the absolute value of `self`.
    ///
    /// # Overflow behavior
    ///
    /// The absolute value of `Self::MIN` cannot be represented as `Self` and
    /// attempting to calculate it will cause an overflow. This means that code
    /// in debug mode will trigger a panic on this case and optimized code will
    /// return `Self::MIN` without a panic.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn abs(self) -> Self {
        handle_overflow(self.overflowing_abs())
    }

    /// Computes the absolute value of `self`.
    ///
    /// Returns a tuple of the absolute version of self along with a boolean
    /// indicating whether an overflow happened. If self is the minimum
    /// value then the minimum value will be returned again and true will be
    /// returned for an overflow happening.
    #[inline]
    #[must_use]
    pub fn overflowing_abs(self) -> (Self, bool) {
        if BITS == 0 {
            return (self, false);
        }
        if self == Self::MIN {
            (self, true)
        } else {
            (Self(self.unsigned_abs()), false)
        }
    }

    /// Checked absolute value. Computes `self.abs()`, returning `None` if `self
    /// == MIN`.
    #[inline]
    #[must_use]
    pub fn checked_abs(self) -> Option<Self> {
        match self.overflowing_abs() {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Saturating absolute value. Computes `self.abs()`, returning `MAX` if
    /// `self == MIN` instead of overflowing.
    #[inline]
    #[must_use]
    pub fn saturating_abs(self) -> Self {
        match self.overflowing_abs() {
            (value, false) => value,
            _ => Self::MAX,
        }
    }

    /// Wrapping absolute value. Computes `self.abs()`, wrapping around at the
    /// boundary of the type.
    #[inline]
    #[must_use]
    pub fn wrapping_abs(self) -> Self {
        self.overflowing_abs().0
    }

    /// Computes the absolute value of `self` without any wrapping or panicking.
    #[inline]
    #[must_use]
    pub fn unsigned_abs(self) -> Uint<BITS, LIMBS> {
        self.into_sign_and_abs().1
    }

    /// Negates self, overflowing if this is equal to the minimum value.
    ///
    /// Returns a tuple of the negated version of self along with a boolean
    /// indicating whether an overflow happened. If `self` is the minimum
    /// value, then the minimum value will be returned again and `true` will
    /// be returned for an overflow happening.
    #[inline]
    #[must_use]
    pub fn overflowing_neg(self) -> (Self, bool) {
        if BITS == 0 {
            return (self, false);
        }
        if self == Self::MIN {
            (self, true)
        } else {
            (Self(twos_complement(self.0)), false)
        }
    }

    /// Checked negation. Computes `-self`, returning `None` if `self == MIN`.
    #[inline]
    #[must_use]
    pub fn checked_neg(self) -> Option<Self> {
        match self.overflowing_neg() {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Saturating negation. Computes `-self`, returning `MAX` if `self == MIN`
    /// instead of overflowing.
    #[inline]
    #[must_use]
    pub fn saturating_neg(self) -> Self {
        match self.overflowing_neg() {
            (value, false) => value,
            _ => Self::MAX,
        }
    }

    /// Wrapping (modular) negation. Computes `-self`, wrapping around at the
    /// boundary of the type.
    ///
    /// The only case where such wrapping can occur is when one negates `MIN` on
    /// a signed type (where `MIN` is the negative minimal value for the
    /// type); this is a positive value that is too large to represent in
    /// the type. In such a case, this function returns `MIN` itself.
    #[inline]
    #[must_use]
    pub fn wrapping_neg(self) -> Self {
        self.overflowing_neg().0
    }

    /// Calculates `self` + `rhs`
    ///
    /// Returns a tuple of the addition along with a boolean indicating whether
    /// an arithmetic overflow would occur. If an overflow would have
    /// occurred then the wrapped value is returned.
    #[inline]
    #[must_use]
    pub const fn overflowing_add(self, rhs: Self) -> (Self, bool) {
        let (unsigned, _) = self.0.overflowing_add(rhs.0);
        let result = Self(unsigned);

        // NOTE: Overflow is determined by checking the sign of the operands and
        //   the result.
        let overflow = matches!(
            (self.sign(), rhs.sign(), result.sign()),
            (Sign::Positive, Sign::Positive, Sign::Negative)
                | (Sign::Negative, Sign::Negative, Sign::Positive)
        );

        (result, overflow)
    }

    /// Checked integer addition. Computes `self + rhs`, returning `None` if
    /// overflow occurred.
    #[inline]
    #[must_use]
    pub const fn checked_add(self, rhs: Self) -> Option<Self> {
        match self.overflowing_add(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Saturating integer addition. Computes `self + rhs`, saturating at the
    /// numeric bounds instead of overflowing.
    #[inline]
    #[must_use]
    pub const fn saturating_add(self, rhs: Self) -> Self {
        let (result, overflow) = self.overflowing_add(rhs);
        if overflow {
            match result.sign() {
                Sign::Positive => Self::MIN,
                Sign::Negative => Self::MAX,
            }
        } else {
            result
        }
    }

    /// Wrapping (modular) addition. Computes `self + rhs`, wrapping around at
    /// the boundary of the type.
    #[inline]
    #[must_use]
    pub const fn wrapping_add(self, rhs: Self) -> Self {
        self.overflowing_add(rhs).0
    }

    /// Calculates `self` - `rhs`
    ///
    /// Returns a tuple of the subtraction along with a boolean indicating
    /// whether an arithmetic overflow would occur. If an overflow would
    /// have occurred then the wrapped value is returned.
    #[inline]
    #[must_use]
    pub const fn overflowing_sub(self, rhs: Self) -> (Self, bool) {
        // NOTE: We can't just compute the `self + (-rhs)` because `-rhs` does
        //   not always exist, specifically this would be a problem in case
        //   `rhs == Self::MIN`

        let (unsigned, _) = self.0.overflowing_sub(rhs.0);
        let result = Self(unsigned);

        // NOTE: Overflow is determined by checking the sign of the operands and
        //   the result.
        let overflow = matches!(
            (self.sign(), rhs.sign(), result.sign()),
            (Sign::Positive, Sign::Negative, Sign::Negative)
                | (Sign::Negative, Sign::Positive, Sign::Positive)
        );

        (result, overflow)
    }

    /// Checked integer subtraction. Computes `self - rhs`, returning `None` if
    /// overflow occurred.
    #[inline]
    #[must_use]
    pub const fn checked_sub(self, rhs: Self) -> Option<Self> {
        match self.overflowing_sub(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Saturating integer subtraction. Computes `self - rhs`, saturating at the
    /// numeric bounds instead of overflowing.
    #[inline]
    #[must_use]
    pub const fn saturating_sub(self, rhs: Self) -> Self {
        let (result, overflow) = self.overflowing_sub(rhs);
        if overflow {
            match result.sign() {
                Sign::Positive => Self::MIN,
                Sign::Negative => Self::MAX,
            }
        } else {
            result
        }
    }

    /// Wrapping (modular) subtraction. Computes `self - rhs`, wrapping around
    /// at the boundary of the type.
    #[inline]
    #[must_use]
    pub const fn wrapping_sub(self, rhs: Self) -> Self {
        self.overflowing_sub(rhs).0
    }

    /// Calculates `self` * `rhs`
    ///
    /// Returns a tuple of the multiplication along with a boolean indicating
    /// whether an arithmetic overflow would occur. If an overflow would
    /// have occurred then the wrapped value is returned.
    #[inline]
    #[must_use]
    pub fn overflowing_mul(self, rhs: Self) -> (Self, bool) {
        if self.is_zero() || rhs.is_zero() {
            return (Self::ZERO, false);
        }
        let sign = self.sign() * rhs.sign();
        let (unsigned, overflow_mul) = self.unsigned_abs().overflowing_mul(rhs.unsigned_abs());
        let (result, overflow_conv) = Self::overflowing_from_sign_and_abs(sign, unsigned);

        (result, overflow_mul || overflow_conv)
    }

    /// Checked integer multiplication. Computes `self * rhs`, returning None if
    /// overflow occurred.
    #[inline]
    #[must_use]
    pub fn checked_mul(self, rhs: Self) -> Option<Self> {
        match self.overflowing_mul(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Saturating integer multiplication. Computes `self * rhs`, saturating at
    /// the numeric bounds instead of overflowing.
    #[inline]
    #[must_use]
    pub fn saturating_mul(self, rhs: Self) -> Self {
        let (result, overflow) = self.overflowing_mul(rhs);
        if overflow {
            match self.sign() * rhs.sign() {
                Sign::Positive => Self::MAX,
                Sign::Negative => Self::MIN,
            }
        } else {
            result
        }
    }

    /// Wrapping (modular) multiplication. Computes `self * rhs`, wrapping
    /// around at the boundary of the type.
    #[inline]
    #[must_use]
    pub fn wrapping_mul(self, rhs: Self) -> Self {
        self.overflowing_mul(rhs).0
    }

    /// Calculates `self` / `rhs`
    ///
    /// Returns a tuple of the divisor along with a boolean indicating whether
    /// an arithmetic overflow would occur. If an overflow would occur then
    /// self is returned.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn overflowing_div(self, rhs: Self) -> (Self, bool) {
        assert!(!rhs.is_zero(), "attempt to divide by zero");
        let sign = self.sign() * rhs.sign();
        // Note, signed division can't overflow!
        let unsigned = self.unsigned_abs() / rhs.unsigned_abs();
        let (result, overflow_conv) = Self::overflowing_from_sign_and_abs(sign, unsigned);

        (result, overflow_conv && !result.is_zero())
    }

    /// Checked integer division. Computes `self / rhs`, returning `None` if
    /// `rhs == 0` or the division results in overflow.
    #[inline]
    #[must_use]
    pub fn checked_div(self, rhs: Self) -> Option<Self> {
        if rhs.is_zero() || (self == Self::MIN && rhs == Self::MINUS_ONE) {
            None
        } else {
            Some(self.overflowing_div(rhs).0)
        }
    }

    /// Saturating integer division. Computes `self / rhs`, saturating at the
    /// numeric bounds instead of overflowing.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn saturating_div(self, rhs: Self) -> Self {
        match self.overflowing_div(rhs) {
            (value, false) => value,
            // MIN / -1 is the only possible saturating overflow
            _ => Self::MAX,
        }
    }

    /// Wrapping (modular) division. Computes `self / rhs`, wrapping around at
    /// the boundary of the type.
    ///
    /// The only case where such wrapping can occur is when one divides `MIN /
    /// -1` on a signed type (where `MIN` is the negative minimal value for
    /// the type); this is equivalent to `-MIN`, a positive value that is
    /// too large to represent in the type. In such a case, this function
    /// returns `MIN` itself.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn wrapping_div(self, rhs: Self) -> Self {
        self.overflowing_div(rhs).0
    }

    /// Calculates `self` % `rhs`
    ///
    /// Returns a tuple of the remainder after dividing along with a boolean
    /// indicating whether an arithmetic overflow would occur. If an
    /// overflow would occur then 0 is returned.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn overflowing_rem(self, rhs: Self) -> (Self, bool) {
        if self == Self::MIN && rhs == Self::MINUS_ONE {
            (Self::ZERO, true)
        } else {
            let div_res = self / rhs;
            (self - div_res * rhs, false)
        }
    }

    /// Checked integer remainder. Computes `self % rhs`, returning `None` if
    /// `rhs == 0` or the division results in overflow.
    #[inline]
    #[must_use]
    pub fn checked_rem(self, rhs: Self) -> Option<Self> {
        if rhs.is_zero() || (self == Self::MIN && rhs == Self::MINUS_ONE) {
            None
        } else {
            Some(self.overflowing_rem(rhs).0)
        }
    }

    /// Wrapping (modular) remainder. Computes `self % rhs`, wrapping around at
    /// the boundary of the type.
    ///
    /// Such wrap-around never actually occurs mathematically; implementation
    /// artifacts make `x % y` invalid for `MIN / -1` on a signed type
    /// (where `MIN` is the negative minimal value). In such a case, this
    /// function returns `0`.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn wrapping_rem(self, rhs: Self) -> Self {
        self.overflowing_rem(rhs).0
    }

    /// Calculates the quotient of Euclidean division of `self` by `rhs`.
    ///
    /// This computes the integer `q` such that `self = q * rhs + r`, with
    /// `r = self.rem_euclid(rhs)` and `0 <= r < abs(rhs)`.
    ///
    /// In other words, the result is `self / rhs` rounded to the integer `q`
    /// such that `self >= q * rhs`.
    /// If `self > 0`, this is equal to round towards zero (the default in
    /// Rust); if `self < 0`, this is equal to round towards +/- infinity.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0 or the division results in overflow.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn div_euclid(self, rhs: Self) -> Self {
        let q = self / rhs;
        if (self % rhs).is_negative() {
            if rhs.is_positive() {
                q - Self::ONE
            } else {
                q + Self::ONE
            }
        } else {
            q
        }
    }

    /// Calculates the quotient of Euclidean division `self.div_euclid(rhs)`.
    ///
    /// Returns a tuple of the divisor along with a boolean indicating whether
    /// an arithmetic overflow would occur. If an overflow would occur then
    /// `self` is returned.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn overflowing_div_euclid(self, rhs: Self) -> (Self, bool) {
        if self == Self::MIN && rhs == Self::MINUS_ONE {
            (self, true)
        } else {
            (self.div_euclid(rhs), false)
        }
    }

    /// Checked Euclidean division. Computes `self.div_euclid(rhs)`, returning
    /// `None` if `rhs == 0` or the division results in overflow.
    #[inline]
    #[must_use]
    pub fn checked_div_euclid(self, rhs: Self) -> Option<Self> {
        if rhs.is_zero() || (self == Self::MIN && rhs == Self::MINUS_ONE) {
            None
        } else {
            Some(self.div_euclid(rhs))
        }
    }

    /// Wrapping Euclidean division. Computes `self.div_euclid(rhs)`,
    /// wrapping around at the boundary of the type.
    ///
    /// Wrapping will only occur in `MIN / -1` on a signed type (where `MIN` is
    /// the negative minimal value for the type). This is equivalent to
    /// `-MIN`, a positive value that is too large to represent in the type.
    /// In this case, this method returns `MIN` itself.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn wrapping_div_euclid(self, rhs: Self) -> Self {
        self.overflowing_div_euclid(rhs).0
    }

    /// Calculates the least nonnegative remainder of `self (mod rhs)`.
    ///
    /// This is done as if by the Euclidean division algorithm -- given `r =
    /// self.rem_euclid(rhs)`, `self = rhs * self.div_euclid(rhs) + r`, and
    /// `0 <= r < abs(rhs)`.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0 or the division results in overflow.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn rem_euclid(self, rhs: Self) -> Self {
        let r = self % rhs;
        if r < Self::ZERO {
            if rhs < Self::ZERO {
                r - rhs
            } else {
                r + rhs
            }
        } else {
            r
        }
    }

    /// Overflowing Euclidean remainder. Calculates `self.rem_euclid(rhs)`.
    ///
    /// Returns a tuple of the remainder after dividing along with a boolean
    /// indicating whether an arithmetic overflow would occur. If an
    /// overflow would occur then 0 is returned.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn overflowing_rem_euclid(self, rhs: Self) -> (Self, bool) {
        if self == Self::MIN && rhs == Self::MINUS_ONE {
            (Self::ZERO, true)
        } else {
            (self.rem_euclid(rhs), false)
        }
    }

    /// Wrapping Euclidean remainder. Computes `self.rem_euclid(rhs)`, wrapping
    /// around at the boundary of the type.
    ///
    /// Wrapping will only occur in `MIN % -1` on a signed type (where `MIN` is
    /// the negative minimal value for the type). In this case, this method
    /// returns 0.
    ///
    /// # Panics
    ///
    /// If `rhs` is 0.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn wrapping_rem_euclid(self, rhs: Self) -> Self {
        self.overflowing_rem_euclid(rhs).0
    }

    /// Checked Euclidean remainder. Computes `self.rem_euclid(rhs)`, returning
    /// `None` if `rhs == 0` or the division results in overflow.
    #[inline]
    #[must_use]
    pub fn checked_rem_euclid(self, rhs: Self) -> Option<Self> {
        if rhs.is_zero() || (self == Self::MIN && rhs == Self::MINUS_ONE) {
            None
        } else {
            Some(self.rem_euclid(rhs))
        }
    }

    /// Returns the sign of `self` to the exponent `exp`.
    ///
    /// Note that this method does not actually try to compute the `self` to the
    /// exponent `exp`, but instead uses the property that a negative number to
    /// an odd exponent will be negative. This means that the sign of the result
    /// of exponentiation can be computed even if the actual result is too large
    /// to fit in 256-bit signed integer.
    #[inline]
    pub(crate) const fn pow_sign(self, exp: Uint<BITS, LIMBS>) -> Sign {
        let is_exp_odd = BITS != 0 && exp.as_limbs()[0] % 2 == 1;
        if is_exp_odd && self.is_negative() {
            Sign::Negative
        } else {
            Sign::Positive
        }
    }

    /// Create `10**n` as this type.
    ///
    /// # Panics
    ///
    /// If the result overflows the type.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn exp10(n: usize) -> Self {
        Uint::<BITS, LIMBS>::from(10).pow(Uint::from(n)).try_into().expect("overflow")
    }

    /// Raises self to the power of `exp`, using exponentiation by squaring.
    ///
    /// # Panics
    ///
    /// If the result overflows the type in debug mode.
    #[inline]
    #[track_caller]
    #[must_use]
    pub fn pow(self, exp: Uint<BITS, LIMBS>) -> Self {
        handle_overflow(self.overflowing_pow(exp))
    }

    /// Raises self to the power of `exp`, using exponentiation by squaring.
    ///
    /// Returns a tuple of the exponentiation along with a bool indicating
    /// whether an overflow happened.
    #[inline]
    #[must_use]
    pub fn overflowing_pow(self, exp: Uint<BITS, LIMBS>) -> (Self, bool) {
        if BITS == 0 {
            return (Self::ZERO, false);
        }

        let sign = self.pow_sign(exp);

        let (unsigned, overflow_pow) = self.unsigned_abs().overflowing_pow(exp);
        let (result, overflow_conv) = Self::overflowing_from_sign_and_abs(sign, unsigned);

        (result, overflow_pow || overflow_conv)
    }

    /// Checked exponentiation. Computes `self.pow(exp)`, returning `None` if
    /// overflow occurred.
    #[inline]
    #[must_use]
    pub fn checked_pow(self, exp: Uint<BITS, LIMBS>) -> Option<Self> {
        let (result, overflow) = self.overflowing_pow(exp);
        if overflow {
            None
        } else {
            Some(result)
        }
    }

    /// Saturating integer exponentiation. Computes `self.pow(exp)`, saturating
    /// at the numeric bounds instead of overflowing.
    #[inline]
    #[must_use]
    pub fn saturating_pow(self, exp: Uint<BITS, LIMBS>) -> Self {
        let (result, overflow) = self.overflowing_pow(exp);
        if overflow {
            match self.pow_sign(exp) {
                Sign::Positive => Self::MAX,
                Sign::Negative => Self::MIN,
            }
        } else {
            result
        }
    }

    /// Raises self to the power of `exp`, wrapping around at the
    /// boundary of the type.
    #[inline]
    #[must_use]
    pub fn wrapping_pow(self, exp: Uint<BITS, LIMBS>) -> Self {
        self.overflowing_pow(exp).0
    }

    /// Shifts self left by `rhs` bits.
    ///
    /// Returns a tuple of the shifted version of self along with a boolean
    /// indicating whether the shift value was larger than or equal to the
    /// number of bits.
    #[inline]
    #[must_use]
    pub fn overflowing_shl(self, rhs: usize) -> (Self, bool) {
        if rhs >= 256 {
            (Self::ZERO, true)
        } else {
            (Self(self.0 << rhs), false)
        }
    }

    /// Checked shift left. Computes `self << rhs`, returning `None` if `rhs` is
    /// larger than or equal to the number of bits in `self`.
    #[inline]
    #[must_use]
    pub fn checked_shl(self, rhs: usize) -> Option<Self> {
        match self.overflowing_shl(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Wrapping shift left. Computes `self << rhs`, returning 0 if larger than
    /// or equal to the number of bits in `self`.
    #[inline]
    #[must_use]
    pub fn wrapping_shl(self, rhs: usize) -> Self {
        self.overflowing_shl(rhs).0
    }

    /// Shifts self right by `rhs` bits.
    ///
    /// Returns a tuple of the shifted version of self along with a boolean
    /// indicating whether the shift value was larger than or equal to the
    /// number of bits.
    #[inline]
    #[must_use]
    pub fn overflowing_shr(self, rhs: usize) -> (Self, bool) {
        if rhs >= 256 {
            (Self::ZERO, true)
        } else {
            (Self(self.0 >> rhs), false)
        }
    }

    /// Checked shift right. Computes `self >> rhs`, returning `None` if `rhs`
    /// is larger than or equal to the number of bits in `self`.
    #[inline]
    #[must_use]
    pub fn checked_shr(self, rhs: usize) -> Option<Self> {
        match self.overflowing_shr(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Wrapping shift right. Computes `self >> rhs`, returning 0 if larger than
    /// or equal to the number of bits in `self`.
    #[inline]
    #[must_use]
    pub fn wrapping_shr(self, rhs: usize) -> Self {
        self.overflowing_shr(rhs).0
    }

    /// Arithmetic shift right operation. Computes `self >> rhs` maintaining the
    /// original sign. If the number is positive this is the same as logic
    /// shift right.
    #[inline]
    #[must_use]
    pub fn asr(self, rhs: usize) -> Self {
        // Avoid shifting if we are going to know the result regardless of the value.
        if rhs == 0 || BITS == 0 {
            return self;
        }

        if rhs >= BITS - 1 {
            match self.sign() {
                Sign::Positive => return Self::ZERO,
                Sign::Negative => return Self::MINUS_ONE,
            }
        }

        match self.sign() {
            // Perform the shift.
            Sign::Positive => self.wrapping_shr(rhs),
            Sign::Negative => {
                // We need to do: `for 0..shift { self >> 1 | 2^255 }`
                // We can avoid the loop by doing: `self >> shift | ~(2^(255 - shift) - 1)`
                // where '~' represents ones complement
                let two: Uint<BITS, LIMBS> = Uint::from(2);
                let bitwise_or = Self::from_raw(
                    !(two.pow(Uint::<BITS, LIMBS>::from(BITS - rhs))
                        - Uint::<BITS, LIMBS>::from(1)),
                );
                (self.wrapping_shr(rhs)) | bitwise_or
            }
        }
    }

    /// Arithmetic shift left operation. Computes `self << rhs`, checking for
    /// overflow on the final result.
    ///
    /// Returns `None` if the operation overflowed (most significant bit
    /// changes).
    #[inline]
    #[must_use]
    pub fn asl(self, rhs: usize) -> Option<Self> {
        if rhs == 0 || BITS == 0 {
            Some(self)
        } else {
            let result = self.wrapping_shl(rhs);
            if result.sign() != self.sign() {
                // Overflow occurred
                None
            } else {
                Some(result)
            }
        }
    }

    /// Compute the [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) of this number.
    #[inline]
    #[must_use]
    pub fn twos_complement(self) -> Uint<BITS, LIMBS> {
        let abs = self.into_raw();
        match self.sign() {
            Sign::Positive => abs,
            Sign::Negative => twos_complement(abs),
        }
    }
}

// Implement Shl and Shr only for types <= usize, since U256 uses .as_usize()
// which panics
macro_rules! impl_shift {
    ($($t:ty),+) => {
        // We are OK with wrapping behaviour here because it's how Rust behaves with the primitive
        // integer types.

        // $t <= usize: cast to usize
        $(
            impl<const BITS: usize, const LIMBS: usize> ops::Shl<$t> for Signed<BITS, LIMBS> {
                type Output = Self;

                #[inline]
                fn shl(self, rhs: $t) -> Self::Output {
                    self.wrapping_shl(rhs as usize)
                }
            }

            impl<const BITS: usize, const LIMBS: usize> ops::ShlAssign<$t> for Signed<BITS, LIMBS> {
                #[inline]
                fn shl_assign(&mut self, rhs: $t) {
                    *self = *self << rhs;
                }
            }

            impl<const BITS: usize, const LIMBS: usize> ops::Shr<$t> for Signed<BITS, LIMBS> {
                type Output = Self;

                #[inline]
                fn shr(self, rhs: $t) -> Self::Output {
                    self.wrapping_shr(rhs as usize)
                }
            }

            impl<const BITS: usize, const LIMBS: usize> ops::ShrAssign<$t> for Signed<BITS, LIMBS> {
                #[inline]
                fn shr_assign(&mut self, rhs: $t) {
                    *self = *self >> rhs;
                }
            }
        )+
    };
}

#[cfg(target_pointer_width = "16")]
impl_shift!(i8, u8, i16, u16, isize, usize);

#[cfg(target_pointer_width = "32")]
impl_shift!(i8, u8, i16, u16, i32, u32, isize, usize);

#[cfg(target_pointer_width = "64")]
impl_shift!(i8, u8, i16, u16, i32, u32, i64, u64, isize, usize);

// cmp
impl<const BITS: usize, const LIMBS: usize> cmp::PartialOrd for Signed<BITS, LIMBS> {
    #[inline]
    fn partial_cmp(&self, other: &Self) -> Option<cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl<const BITS: usize, const LIMBS: usize> cmp::Ord for Signed<BITS, LIMBS> {
    #[inline]
    fn cmp(&self, other: &Self) -> cmp::Ordering {
        // TODO(nlordell): Once subtraction is implemented:
        // self.saturating_sub(*other).signum64().partial_cmp(&0)

        use cmp::Ordering::*;
        use Sign::*;

        match (self.into_sign_and_abs(), other.into_sign_and_abs()) {
            ((Positive, _), (Negative, _)) => Greater,
            ((Negative, _), (Positive, _)) => Less,
            ((Positive, this), (Positive, other)) => this.cmp(&other),
            ((Negative, this), (Negative, other)) => other.cmp(&this),
        }
    }
}

// arithmetic ops - implemented above
impl<T, const BITS: usize, const LIMBS: usize> ops::Add<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    type Output = Self;

    #[inline]
    #[track_caller]
    fn add(self, rhs: T) -> Self::Output {
        handle_overflow(self.overflowing_add(rhs.into()))
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::AddAssign<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn add_assign(&mut self, rhs: T) {
        *self = *self + rhs;
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::Sub<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    type Output = Self;

    #[inline]
    #[track_caller]
    fn sub(self, rhs: T) -> Self::Output {
        handle_overflow(self.overflowing_sub(rhs.into()))
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::SubAssign<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn sub_assign(&mut self, rhs: T) {
        *self = *self - rhs;
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::Mul<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    type Output = Self;

    #[inline]
    #[track_caller]
    fn mul(self, rhs: T) -> Self::Output {
        handle_overflow(self.overflowing_mul(rhs.into()))
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::MulAssign<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn mul_assign(&mut self, rhs: T) {
        *self = *self * rhs;
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::Div<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    type Output = Self;

    #[inline]
    #[track_caller]
    fn div(self, rhs: T) -> Self::Output {
        handle_overflow(self.overflowing_div(rhs.into()))
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::DivAssign<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn div_assign(&mut self, rhs: T) {
        *self = *self / rhs;
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::Rem<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    type Output = Self;

    #[inline]
    #[track_caller]
    fn rem(self, rhs: T) -> Self::Output {
        handle_overflow(self.overflowing_rem(rhs.into()))
    }
}

impl<T, const BITS: usize, const LIMBS: usize> ops::RemAssign<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn rem_assign(&mut self, rhs: T) {
        *self = *self % rhs;
    }
}

impl<T, const BITS: usize, const LIMBS: usize> iter::Sum<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn sum<I: Iterator<Item = T>>(iter: I) -> Self {
        iter.fold(Self::ZERO, |acc, x| acc + x)
    }
}

impl<T, const BITS: usize, const LIMBS: usize> iter::Product<T> for Signed<BITS, LIMBS>
where
    T: Into<Self>,
{
    #[inline]
    #[track_caller]
    fn product<I: Iterator<Item = T>>(iter: I) -> Self {
        iter.fold(Self::ONE, |acc, x| acc * x)
    }
}

// bitwise ops - delegated to U256
impl<const BITS: usize, const LIMBS: usize> ops::BitAnd for Signed<BITS, LIMBS> {
    type Output = Self;

    #[inline]
    fn bitand(self, rhs: Self) -> Self::Output {
        Self(self.0 & rhs.0)
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::BitAndAssign for Signed<BITS, LIMBS> {
    #[inline]
    fn bitand_assign(&mut self, rhs: Self) {
        *self = *self & rhs;
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::BitOr for Signed<BITS, LIMBS> {
    type Output = Self;

    #[inline]
    fn bitor(self, rhs: Self) -> Self::Output {
        Self(self.0 | rhs.0)
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::BitOrAssign for Signed<BITS, LIMBS> {
    #[inline]
    fn bitor_assign(&mut self, rhs: Self) {
        *self = *self | rhs;
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::BitXor for Signed<BITS, LIMBS> {
    type Output = Self;

    #[inline]
    fn bitxor(self, rhs: Self) -> Self::Output {
        Self(self.0 ^ rhs.0)
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::BitXorAssign for Signed<BITS, LIMBS> {
    #[inline]
    fn bitxor_assign(&mut self, rhs: Self) {
        *self = *self ^ rhs;
    }
}

// unary ops
impl<const BITS: usize, const LIMBS: usize> ops::Neg for Signed<BITS, LIMBS> {
    type Output = Self;

    #[inline]
    #[track_caller]
    fn neg(self) -> Self::Output {
        handle_overflow(self.overflowing_neg())
    }
}

impl<const BITS: usize, const LIMBS: usize> ops::Not for Signed<BITS, LIMBS> {
    type Output = Self;

    #[inline]
    fn not(self) -> Self::Output {
        Self(!self.0)
    }
}
```
```rs [./src/signed/utils.rs]
use crate::signed::Signed;
use ruint::Uint;

/// Panic if overflow on debug mode.
#[inline]
#[track_caller]
pub(super) const fn handle_overflow<T: Copy>((result, overflow): (T, bool)) -> T {
    debug_assert!(!overflow, "overflow");
    result
}

/// Compute the two's complement of a U256.
#[inline]
pub(super) fn twos_complement<const BITS: usize, const LIMBS: usize>(
    u: Uint<BITS, LIMBS>,
) -> Uint<BITS, LIMBS> {
    if BITS == 0 {
        return u;
    }
    (!u).overflowing_add(Uint::<BITS, LIMBS>::from(1)).0
}

/// Compile-time equality of signed integers.
#[inline]
pub(super) const fn const_eq<const BITS: usize, const LIMBS: usize>(
    left: &Signed<BITS, LIMBS>,
    right: &Signed<BITS, LIMBS>,
) -> bool {
    if BITS == 0 {
        return true;
    }

    let mut i = 0;
    let llimbs = left.0.as_limbs();
    let rlimbs = right.0.as_limbs();
    while i < LIMBS {
        if llimbs[i] != rlimbs[i] {
            return false;
        }
        i += 1;
    }
    true
}

/// Compute the max value at compile time.
pub(super) const fn max<const BITS: usize, const LIMBS: usize>() -> Signed<BITS, LIMBS> {
    if LIMBS == 0 {
        return zero();
    }

    let mut limbs = [u64::MAX; LIMBS];
    limbs[LIMBS - 1] &= Signed::<BITS, LIMBS>::MASK; // unset all high bits
    limbs[LIMBS - 1] &= !Signed::<BITS, LIMBS>::SIGN_BIT; // unset the sign bit
    Signed(Uint::from_limbs(limbs))
}

pub(super) const fn min<const BITS: usize, const LIMBS: usize>() -> Signed<BITS, LIMBS> {
    if LIMBS == 0 {
        return zero();
    }

    let mut limbs = [0; LIMBS];
    limbs[LIMBS - 1] = Signed::<BITS, LIMBS>::SIGN_BIT;
    Signed(Uint::from_limbs(limbs))
}

pub(super) const fn zero<const BITS: usize, const LIMBS: usize>() -> Signed<BITS, LIMBS> {
    let limbs = [0; LIMBS];
    Signed(Uint::from_limbs(limbs))
}

pub(super) const fn one<const BITS: usize, const LIMBS: usize>() -> Signed<BITS, LIMBS> {
    if LIMBS == 0 {
        return zero();
    }

    let mut limbs = [0; LIMBS];
    limbs[0] = 1;
    Signed(Uint::from_limbs(limbs))
}

/// Location of the sign bit within the highest limb.
pub(super) const fn sign_bit(bits: usize) -> u64 {
    if bits == 0 {
        return 0;
    }
    let bits = bits % 64;
    if bits == 0 {
        1 << 63
    } else {
        1 << (bits - 1)
    }
}
```
```rs [./src/map/fixed.rs]
use super::*;
use crate::{Address, FixedBytes, Selector, B256};
use cfg_if::cfg_if;
use core::{
    fmt,
    hash::{BuildHasher, Hasher},
};

/// [`HashMap`] optimized for hashing [fixed-size byte arrays](FixedBytes).
pub type FbMap<const N: usize, V> = HashMap<FixedBytes<N>, V, FbBuildHasher<N>>;
#[doc(hidden)]
pub type FbHashMap<const N: usize, V> = FbMap<N, V>;
/// [`HashSet`] optimized for hashing [fixed-size byte arrays](FixedBytes).
pub type FbSet<const N: usize> = HashSet<FixedBytes<N>, FbBuildHasher<N>>;
#[doc(hidden)]
pub type FbHashSet<const N: usize> = FbSet<N>;

cfg_if! {
    if #[cfg(feature = "map-indexmap")] {
        /// [`IndexMap`] optimized for hashing [fixed-size byte arrays](FixedBytes).
        pub type FbIndexMap<const N: usize, V> =
            indexmap::IndexMap<FixedBytes<N>, V, FbBuildHasher<N>>;
        /// [`IndexSet`] optimized for hashing [fixed-size byte arrays](FixedBytes).
        pub type FbIndexSet<const N: usize> =
            indexmap::IndexSet<FixedBytes<N>, FbBuildHasher<N>>;
    }
}

macro_rules! fb_alias_maps {
    ($($ty:ident < $n:literal >),* $(,)?) => { paste::paste! {
        $(
            #[doc = concat!("[`HashMap`] optimized for hashing [`", stringify!($ty), "`].")]
            pub type [<$ty Map>]<V> = HashMap<$ty, V, FbBuildHasher<$n>>;
            #[doc(hidden)]
            pub type [<$ty HashMap>]<V> = [<$ty Map>]<V>;
            #[doc = concat!("[`HashSet`] optimized for hashing [`", stringify!($ty), "`].")]
            pub type [<$ty Set>] = HashSet<$ty, FbBuildHasher<$n>>;
            #[doc(hidden)]
            pub type [<$ty HashSet>] = [<$ty Set>];

            cfg_if! {
                if #[cfg(feature = "map-indexmap")] {
                    #[doc = concat!("[`IndexMap`] optimized for hashing [`", stringify!($ty), "`].")]
                    pub type [<$ty IndexMap>]<V> = IndexMap<$ty, V, FbBuildHasher<$n>>;
                    #[doc = concat!("[`IndexSet`] optimized for hashing [`", stringify!($ty), "`].")]
                    pub type [<$ty IndexSet>] = IndexSet<$ty, FbBuildHasher<$n>>;
                }
            }
        )*
    } };
}

fb_alias_maps!(Selector<4>, Address<20>, B256<32>);

#[allow(unused_macros)]
macro_rules! assert_unchecked {
    ($e:expr) => { assert_unchecked!($e,); };
    ($e:expr, $($t:tt)*) => {
        if cfg!(debug_assertions) {
            assert!($e, $($t)*);
        } else if !$e {
            unsafe { core::hint::unreachable_unchecked() }
        }
    };
}

macro_rules! assert_eq_unchecked {
    ($a:expr, $b:expr) => { assert_eq_unchecked!($a, $b,); };
    ($a:expr, $b:expr, $($t:tt)*) => {
        if cfg!(debug_assertions) {
            assert_eq!($a, $b, $($t)*);
        } else if $a != $b {
            unsafe { core::hint::unreachable_unchecked() }
        }
    };
}

/// [`BuildHasher`] optimized for hashing [fixed-size byte arrays](FixedBytes).
///
/// Works best with `fxhash`, enabled by default with the "map-fxhash" feature.
///
/// **NOTE:** this hasher accepts only `N`-length byte arrays! It is invalid to hash anything else.
#[derive(Clone, Default)]
pub struct FbBuildHasher<const N: usize> {
    inner: DefaultHashBuilder,
    _marker: core::marker::PhantomData<[(); N]>,
}

impl<const N: usize> fmt::Debug for FbBuildHasher<N> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("FbBuildHasher").finish_non_exhaustive()
    }
}

impl<const N: usize> BuildHasher for FbBuildHasher<N> {
    type Hasher = FbHasher<N>;

    #[inline]
    fn build_hasher(&self) -> Self::Hasher {
        FbHasher { inner: self.inner.build_hasher(), _marker: core::marker::PhantomData }
    }
}

/// [`Hasher`] optimized for hashing [fixed-size byte arrays](FixedBytes).
///
/// Works best with `fxhash`, enabled by default with the "map-fxhash" feature.
///
/// **NOTE:** this hasher accepts only `N`-length byte arrays! It is invalid to hash anything else.
#[derive(Clone)]
pub struct FbHasher<const N: usize> {
    inner: DefaultHasher,
    _marker: core::marker::PhantomData<[(); N]>,
}

impl<const N: usize> Default for FbHasher<N> {
    #[inline]
    fn default() -> Self {
        Self {
            inner: DefaultHashBuilder::default().build_hasher(),
            _marker: core::marker::PhantomData,
        }
    }
}

impl<const N: usize> fmt::Debug for FbHasher<N> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("FbHasher").finish_non_exhaustive()
    }
}

impl<const N: usize> Hasher for FbHasher<N> {
    #[inline]
    fn finish(&self) -> u64 {
        self.inner.finish()
    }

    #[inline]
    fn write(&mut self, bytes: &[u8]) {
        assert_eq_unchecked!(bytes.len(), N);
        // Threshold decided by some basic micro-benchmarks with fxhash.
        if N > 32 {
            self.inner.write(bytes);
        } else {
            write_bytes_unrolled(&mut self.inner, bytes);
        }
    }

    // We can just skip hashing the length prefix entirely since we know it's always `N`.

    // `write_length_prefix` calls `write_usize` by default.
    #[cfg(not(feature = "nightly"))]
    #[inline]
    fn write_usize(&mut self, i: usize) {
        debug_assert_eq!(i, N);
    }

    #[cfg(feature = "nightly")]
    #[inline]
    fn write_length_prefix(&mut self, len: usize) {
        debug_assert_eq!(len, N);
    }
}

#[inline(always)]
fn write_bytes_unrolled(hasher: &mut impl Hasher, mut bytes: &[u8]) {
    while let Some((chunk, rest)) = bytes.split_first_chunk() {
        hasher.write_usize(usize::from_ne_bytes(*chunk));
        bytes = rest;
    }
    if usize::BITS > 64 {
        if let Some((chunk, rest)) = bytes.split_first_chunk() {
            hasher.write_u64(u64::from_ne_bytes(*chunk));
            bytes = rest;
        }
    }
    if usize::BITS > 32 {
        if let Some((chunk, rest)) = bytes.split_first_chunk() {
            hasher.write_u32(u32::from_ne_bytes(*chunk));
            bytes = rest;
        }
    }
    if usize::BITS > 16 {
        if let Some((chunk, rest)) = bytes.split_first_chunk() {
            hasher.write_u16(u16::from_ne_bytes(*chunk));
            bytes = rest;
        }
    }
    if usize::BITS > 8 {
        if let Some((chunk, rest)) = bytes.split_first_chunk() {
            hasher.write_u8(u8::from_ne_bytes(*chunk));
            bytes = rest;
        }
    }

    debug_assert!(bytes.is_empty());
}

#[cfg(all(test, any(feature = "std", feature = "map-fxhash")))]
mod tests {
    use super::*;

    fn hash_zero<const N: usize>() -> u64 {
        FbBuildHasher::<N>::default().hash_one(&FixedBytes::<N>::ZERO)
    }

    #[test]
    fn fb_hasher() {
        // Just by running it once we test that it compiles and that debug assertions are correct.
        ruint::const_for!(N in [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
                                16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                                32, 47, 48, 49, 63, 64, 127, 128, 256, 512, 1024, 2048, 4096] {
            let _ = hash_zero::<N>();
        });
    }

    #[test]
    fn map() {
        let mut map = AddressHashMap::<bool>::default();
        map.insert(Address::ZERO, true);
        assert_eq!(map.get(&Address::ZERO), Some(&true));
        assert_eq!(map.get(&Address::with_last_byte(1)), None);

        let map2 = map.clone();
        assert_eq!(map.len(), map2.len());
        assert_eq!(map.len(), 1);
        assert_eq!(map2.get(&Address::ZERO), Some(&true));
        assert_eq!(map2.get(&Address::with_last_byte(1)), None);
    }
}
```
```rs [./src/map/mod.rs]
//! Re-exports of map types and utilities.
//!
//! This module exports the following types:
//! - [`HashMap`] and [`HashSet`] from the standard library or `hashbrown` crate. The
//!   "map-hashbrown" feature can be used to force the use of `hashbrown`, and is required in
//!   `no_std` environments.
//! - [`IndexMap`] and [`IndexSet`] from the `indexmap` crate, if the "map-indexmap" feature is
//!   enabled.
//! - The previously-listed hash map types prefixed with `Fb`. These are type aliases with
//!   [`FixedBytes<N>`][fb] as the key, and [`FbBuildHasher`] as the hasher builder. This hasher is
//!   optimized for hashing fixed-size byte arrays, and wraps around the default hasher builder. It
//!   performs best when the hasher is `fxhash`, which is enabled by default with the "map-fxhash"
//!   feature.
//! - The previously-listed hash map types prefixed with [`Selector`], [`Address`], and [`B256`].
//!   These use [`FbBuildHasher`] with the respective fixed-size byte array as the key. See the
//!   previous point for more information.
//!
//! Unless specified otherwise, the default hasher builder used by these types is
//! [`DefaultHashBuilder`]. This hasher prioritizes speed over security. Users who require HashDoS
//! resistance should enable the "rand" feature so that the hasher is initialized using a random
//! seed.
//!
//! Note that using the types provided in this module may require using different APIs than the
//! standard library as they might not be generic over the hasher state, such as using
//! `HashMap::default()` instead of `HashMap::new()`.
//!
//! [fb]: crate::FixedBytes
//! [`Selector`]: crate::Selector
//! [`Address`]: crate::Address
//! [`B256`]: crate::B256

use cfg_if::cfg_if;

mod fixed;
pub use fixed::*;

// The `HashMap` implementation.
// Use `hashbrown` if requested with "map-hashbrown" or required by `no_std`.
cfg_if! {
    if #[cfg(any(feature = "map-hashbrown", not(feature = "std")))] {
        use hashbrown as imp;
    } else {
        use hashbrown as _;
        use std::collections as imp;
    }
}

#[doc(no_inline)]
pub use imp::{hash_map, hash_map::Entry, hash_set};

/// A [`HashMap`](imp::HashMap) using the [default hasher](DefaultHasher).
///
/// See [`HashMap`](imp::HashMap) for more information.
pub type HashMap<K, V, S = DefaultHashBuilder> = imp::HashMap<K, V, S>;
/// A [`HashSet`](imp::HashSet) using the [default hasher](DefaultHasher).
///
/// See [`HashSet`](imp::HashSet) for more information.
pub type HashSet<V, S = DefaultHashBuilder> = imp::HashSet<V, S>;

// Faster hashers.
cfg_if! {
    if #[cfg(feature = "map-fxhash")] {
        #[doc(no_inline)]
        pub use rustc_hash::{self, FxHasher};

        cfg_if! {
            if #[cfg(all(feature = "std", feature = "rand"))] {
                use rustc_hash::FxRandomState as FxBuildHasherInner;
            } else {
                use rustc_hash::FxBuildHasher as FxBuildHasherInner;
            }
        }

        /// The [`FxHasher`] hasher builder.
        ///
        /// This is [`rustc_hash::FxBuildHasher`], unless both the "std" and "rand" features are
        /// enabled, in which case it will be [`rustc_hash::FxRandomState`] for better security at
        /// very little cost.
        pub type FxBuildHasher = FxBuildHasherInner;
    }
}

#[cfg(feature = "map-foldhash")]
#[doc(no_inline)]
pub use foldhash;

// Default hasher.
cfg_if! {
    if #[cfg(feature = "map-foldhash")] {
        type DefaultHashBuilderInner = foldhash::fast::RandomState;
    } else if #[cfg(feature = "map-fxhash")] {
        type DefaultHashBuilderInner = FxBuildHasher;
    } else if #[cfg(any(feature = "map-hashbrown", not(feature = "std")))] {
        type DefaultHashBuilderInner = hashbrown::DefaultHashBuilder;
    } else {
        type DefaultHashBuilderInner = std::collections::hash_map::RandomState;
    }
}
/// The default [`BuildHasher`](core::hash::BuildHasher) used by [`HashMap`] and [`HashSet`].
///
/// See [the module documentation](self) for more information on the default hasher.
pub type DefaultHashBuilder = DefaultHashBuilderInner;
/// The default [`Hasher`](core::hash::Hasher) used by [`HashMap`] and [`HashSet`].
///
/// See [the module documentation](self) for more information on the default hasher.
pub type DefaultHasher = <DefaultHashBuilder as core::hash::BuildHasher>::Hasher;

// `indexmap` re-exports.
cfg_if! {
    if #[cfg(feature = "map-indexmap")] {
        #[doc(no_inline)]
        pub use indexmap::{self, map::Entry as IndexEntry};

        /// [`IndexMap`](indexmap::IndexMap) using the [default hasher](DefaultHasher).
        ///
        /// See [`IndexMap`](indexmap::IndexMap) for more information.
        pub type IndexMap<K, V, S = DefaultHashBuilder> = indexmap::IndexMap<K, V, S>;
        /// [`IndexSet`](indexmap::IndexSet) using the [default hasher](DefaultHasher).
        ///
        /// See [`IndexSet`](indexmap::IndexSet) for more information.
        pub type IndexSet<V, S = DefaultHashBuilder> = indexmap::IndexSet<V, S>;
    }
}

/// This module contains the rayon parallel iterator types for hash maps (HashMap<K, V>).
///
/// You will rarely need to interact with it directly unless you have need to name one
/// of the iterator types.
#[cfg(feature = "rayon")]
pub mod rayon {
    use super::*;

    cfg_if! {
        if #[cfg(any(feature = "map-hashbrown", not(feature = "std")))] {
            pub use hashbrown::hash_map::rayon::{
                IntoParIter as IntoIter,
                ParDrain as Drain,
                ParIter as Iter,
                ParIterMut as IterMut,
                ParKeys as Keys,
                ParValues as Values,
                ParValuesMut as ValuesMut
            };
            use ::rayon as _;
        } else {
            pub use ::rayon::collections::hash_map::*;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_hasher_builder_traits() {
        let hash_builder = <DefaultHashBuilder as Default>::default();
        let _hash_builder2 = <DefaultHashBuilder as Clone>::clone(&hash_builder);
        let mut hasher =
            <DefaultHashBuilder as core::hash::BuildHasher>::build_hasher(&hash_builder);

        <DefaultHasher as core::hash::Hasher>::write_u8(&mut hasher, 0);
        let _hasher2 = <DefaultHasher as Clone>::clone(&hasher);
    }
}
```
```rs [./src/bits/fixed.rs]
use crate::aliases;
use core::{fmt, iter, ops, str};
use derive_more::{Deref, DerefMut, From, Index, IndexMut, IntoIterator};
use hex::FromHex;

/// A byte array of fixed length (`[u8; N]`).
///
/// This type allows us to more tightly control serialization, deserialization.
/// rlp encoding, decoding, and other type-level attributes for fixed-length
/// byte arrays.
///
/// Users looking to prevent type-confusion between byte arrays of different
/// lengths should use the [`wrap_fixed_bytes!`](crate::wrap_fixed_bytes) macro
/// to create a new fixed-length byte array type.
#[derive(
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Hash,
    Deref,
    DerefMut,
    From,
    Index,
    IndexMut,
    IntoIterator,
)]
#[cfg_attr(feature = "arbitrary", derive(derive_arbitrary::Arbitrary, proptest_derive::Arbitrary))]
#[cfg_attr(feature = "allocative", derive(allocative::Allocative))]
#[cfg_attr(feature = "diesel", derive(diesel::AsExpression, diesel::FromSqlRow))]
#[cfg_attr(feature = "diesel", diesel(sql_type = diesel::sql_types::Binary))]
#[repr(transparent)]
pub struct FixedBytes<const N: usize>(#[into_iterator(owned, ref, ref_mut)] pub [u8; N]);

crate::impl_fb_traits!(FixedBytes<N>, N, const);

impl<const N: usize> Default for FixedBytes<N> {
    #[inline]
    fn default() -> Self {
        Self::ZERO
    }
}

impl<const N: usize> Default for &FixedBytes<N> {
    #[inline]
    fn default() -> Self {
        &FixedBytes::ZERO
    }
}

impl<const N: usize> From<&[u8; N]> for FixedBytes<N> {
    #[inline]
    fn from(bytes: &[u8; N]) -> Self {
        Self(*bytes)
    }
}

impl<const N: usize> From<&mut [u8; N]> for FixedBytes<N> {
    #[inline]
    fn from(bytes: &mut [u8; N]) -> Self {
        Self(*bytes)
    }
}

/// Tries to create a `FixedBytes<N>` by copying from a slice `&[u8]`. Succeeds
/// if `slice.len() == N`.
impl<const N: usize> TryFrom<&[u8]> for FixedBytes<N> {
    type Error = core::array::TryFromSliceError;

    #[inline]
    fn try_from(slice: &[u8]) -> Result<Self, Self::Error> {
        <&Self>::try_from(slice).copied()
    }
}

/// Tries to create a `FixedBytes<N>` by copying from a mutable slice `&mut
/// [u8]`. Succeeds if `slice.len() == N`.
impl<const N: usize> TryFrom<&mut [u8]> for FixedBytes<N> {
    type Error = core::array::TryFromSliceError;

    #[inline]
    fn try_from(slice: &mut [u8]) -> Result<Self, Self::Error> {
        Self::try_from(&*slice)
    }
}

/// Tries to create a ref `FixedBytes<N>` by copying from a slice `&[u8]`.
/// Succeeds if `slice.len() == N`.
impl<'a, const N: usize> TryFrom<&'a [u8]> for &'a FixedBytes<N> {
    type Error = core::array::TryFromSliceError;

    #[inline]
    fn try_from(slice: &'a [u8]) -> Result<&'a FixedBytes<N>, Self::Error> {
        // SAFETY: `FixedBytes<N>` is `repr(transparent)` for `[u8; N]`
        <&[u8; N]>::try_from(slice).map(|array_ref| unsafe { core::mem::transmute(array_ref) })
    }
}

/// Tries to create a ref `FixedBytes<N>` by copying from a mutable slice `&mut
/// [u8]`. Succeeds if `slice.len() == N`.
impl<'a, const N: usize> TryFrom<&'a mut [u8]> for &'a mut FixedBytes<N> {
    type Error = core::array::TryFromSliceError;

    #[inline]
    fn try_from(slice: &'a mut [u8]) -> Result<&'a mut FixedBytes<N>, Self::Error> {
        // SAFETY: `FixedBytes<N>` is `repr(transparent)` for `[u8; N]`
        <&mut [u8; N]>::try_from(slice).map(|array_ref| unsafe { core::mem::transmute(array_ref) })
    }
}

// Ideally this would be:
// `impl<const N: usize> From<FixedBytes<N>> for Uint<N * 8>`
// `impl<const N: usize> From<Uint<N / 8>> for FixedBytes<N>`
macro_rules! fixed_bytes_uint_conversions {
    ($($int:ty => $fb:ty),* $(,)?) => {$(
        impl From<$int> for $fb {
            /// Converts a fixed-width unsigned integer into a fixed byte array
            /// by interpreting the bytes as big-endian.
            #[inline]
            fn from(value: $int) -> Self {
                Self(value.to_be_bytes())
            }
        }

        impl From<$fb> for $int {
            /// Converts a fixed byte array into a fixed-width unsigned integer
            /// by interpreting the bytes as big-endian.
            #[inline]
            fn from(value: $fb) -> Self {
                Self::from_be_bytes(value.0)
            }
        }

        const _: () = assert!(<$int>::BITS as usize == <$fb>::len_bytes() * 8);
    )*};
}

fixed_bytes_uint_conversions! {
    u8            => aliases::B8,
    aliases::U8   => aliases::B8,
    i8            => aliases::B8,
    aliases::I8   => aliases::B8,

    u16           => aliases::B16,
    aliases::U16  => aliases::B16,
    i16           => aliases::B16,
    aliases::I16  => aliases::B16,

    u32           => aliases::B32,
    aliases::U32  => aliases::B32,
    i32           => aliases::B32,
    aliases::I32  => aliases::B32,

    u64           => aliases::B64,
    aliases::U64  => aliases::B64,
    i64           => aliases::B64,
    aliases::I64  => aliases::B64,

    u128          => aliases::B128,
    aliases::U128 => aliases::B128,
    i128          => aliases::B128,
    aliases::I128 => aliases::B128,

    aliases::U160 => aliases::B160,
    aliases::I160 => aliases::B160,

    aliases::U256 => aliases::B256,
    aliases::I256 => aliases::B256,

    aliases::U512 => aliases::B512,
    aliases::I512 => aliases::B512,

}

impl<const N: usize> From<FixedBytes<N>> for [u8; N] {
    #[inline]
    fn from(s: FixedBytes<N>) -> Self {
        s.0
    }
}

impl<const N: usize> AsRef<[u8; N]> for FixedBytes<N> {
    #[inline]
    fn as_ref(&self) -> &[u8; N] {
        &self.0
    }
}

impl<const N: usize> AsMut<[u8; N]> for FixedBytes<N> {
    #[inline]
    fn as_mut(&mut self) -> &mut [u8; N] {
        &mut self.0
    }
}

impl<const N: usize> AsRef<[u8]> for FixedBytes<N> {
    #[inline]
    fn as_ref(&self) -> &[u8] {
        &self.0
    }
}

impl<const N: usize> AsMut<[u8]> for FixedBytes<N> {
    #[inline]
    fn as_mut(&mut self) -> &mut [u8] {
        &mut self.0
    }
}

impl<const N: usize> fmt::Debug for FixedBytes<N> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.fmt_hex::<false>(f, true)
    }
}

impl<const N: usize> fmt::Display for FixedBytes<N> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // If the alternate flag is NOT set, we write the full hex.
        if N <= 4 || !f.alternate() {
            return self.fmt_hex::<false>(f, true);
        }

        // If the alternate flag is set, we use middle-out compression.
        const SEP_LEN: usize = '…'.len_utf8();
        let mut buf = [0; 2 + 4 + SEP_LEN + 4];
        buf[0] = b'0';
        buf[1] = b'x';
        hex::encode_to_slice(&self.0[0..2], &mut buf[2..6]).unwrap();
        '…'.encode_utf8(&mut buf[6..]);
        hex::encode_to_slice(&self.0[N - 2..N], &mut buf[6 + SEP_LEN..]).unwrap();

        // SAFETY: always valid UTF-8
        f.write_str(unsafe { str::from_utf8_unchecked(&buf) })
    }
}

impl<const N: usize> fmt::LowerHex for FixedBytes<N> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.fmt_hex::<false>(f, f.alternate())
    }
}

impl<const N: usize> fmt::UpperHex for FixedBytes<N> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.fmt_hex::<true>(f, f.alternate())
    }
}

impl<const N: usize> ops::BitAndAssign for FixedBytes<N> {
    #[inline]
    fn bitand_assign(&mut self, rhs: Self) {
        *self &= &rhs;
    }
}

impl<const N: usize> ops::BitOrAssign for FixedBytes<N> {
    #[inline]
    fn bitor_assign(&mut self, rhs: Self) {
        *self |= &rhs;
    }
}

impl<const N: usize> ops::BitXorAssign for FixedBytes<N> {
    #[inline]
    fn bitxor_assign(&mut self, rhs: Self) {
        *self ^= &rhs;
    }
}

impl<const N: usize> ops::BitAndAssign<&Self> for FixedBytes<N> {
    #[inline]
    fn bitand_assign(&mut self, rhs: &Self) {
        iter::zip(self, rhs).for_each(|(a, b)| *a &= *b);
    }
}

impl<const N: usize> ops::BitOrAssign<&Self> for FixedBytes<N> {
    #[inline]
    fn bitor_assign(&mut self, rhs: &Self) {
        iter::zip(self, rhs).for_each(|(a, b)| *a |= *b);
    }
}

impl<const N: usize> ops::BitXorAssign<&Self> for FixedBytes<N> {
    #[inline]
    fn bitxor_assign(&mut self, rhs: &Self) {
        iter::zip(self, rhs).for_each(|(a, b)| *a ^= *b);
    }
}

impl<const N: usize> ops::BitAnd for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitand(mut self, rhs: Self) -> Self::Output {
        self &= &rhs;
        self
    }
}

impl<const N: usize> ops::BitOr for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitor(mut self, rhs: Self) -> Self::Output {
        self |= &rhs;
        self
    }
}

impl<const N: usize> ops::BitXor for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitxor(mut self, rhs: Self) -> Self::Output {
        self ^= &rhs;
        self
    }
}

impl<const N: usize> ops::BitAnd<&Self> for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitand(mut self, rhs: &Self) -> Self::Output {
        self &= rhs;
        self
    }
}

impl<const N: usize> ops::BitOr<&Self> for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitor(mut self, rhs: &Self) -> Self::Output {
        self |= rhs;
        self
    }
}

impl<const N: usize> ops::BitXor<&Self> for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn bitxor(mut self, rhs: &Self) -> Self::Output {
        self ^= rhs;
        self
    }
}

impl<const N: usize> ops::Not for FixedBytes<N> {
    type Output = Self;

    #[inline]
    fn not(mut self) -> Self::Output {
        self.iter_mut().for_each(|byte| *byte = !*byte);
        self
    }
}

impl<const N: usize> str::FromStr for FixedBytes<N> {
    type Err = hex::FromHexError;

    #[inline]
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::from_hex(s)
    }
}

#[cfg(feature = "rand")]
impl<const N: usize> rand::distr::Distribution<FixedBytes<N>> for rand::distr::StandardUniform {
    #[inline]
    fn sample<R: rand::Rng + ?Sized>(&self, rng: &mut R) -> FixedBytes<N> {
        FixedBytes::random_with(rng)
    }
}

impl<const N: usize> FixedBytes<N> {
    /// Array of Zero bytes.
    pub const ZERO: Self = Self([0u8; N]);

    /// Wraps the given byte array in [`FixedBytes`].
    #[inline]
    pub const fn new(bytes: [u8; N]) -> Self {
        Self(bytes)
    }

    /// Creates a new [`FixedBytes`] with the last byte set to `x`.
    #[inline]
    pub const fn with_last_byte(x: u8) -> Self {
        let mut bytes = [0u8; N];
        if N > 0 {
            bytes[N - 1] = x;
        }
        Self(bytes)
    }

    /// Creates a new [`FixedBytes`] where all bytes are set to `byte`.
    #[inline]
    pub const fn repeat_byte(byte: u8) -> Self {
        Self([byte; N])
    }

    /// Returns the size of this byte array (`N`).
    #[inline(always)]
    pub const fn len_bytes() -> usize {
        N
    }

    /// Creates a new [`FixedBytes`] with the default cryptographic random number generator.
    ///
    /// This is `rand::thread_rng` if the "rand" and "std" features are enabled, otherwise
    /// it uses `getrandom::getrandom`. Both are cryptographically secure.
    #[cfg(feature = "getrandom")]
    #[inline]
    #[track_caller]
    pub fn random() -> Self {
        let mut bytes = Self::ZERO;
        bytes.randomize();
        bytes
    }

    /// Tries to create a new [`FixedBytes`] with the default cryptographic random number
    /// generator.
    ///
    /// See [`random`](Self::random) for more details.
    #[cfg(feature = "getrandom")]
    #[inline]
    pub fn try_random() -> Result<Self, getrandom::Error> {
        let mut bytes = Self::ZERO;
        bytes.try_randomize()?;
        Ok(bytes)
    }

    /// Creates a new [`FixedBytes`] with the given random number generator.
    ///
    /// See [`random`](Self::random) for more details.
    #[cfg(feature = "rand")]
    #[inline]
    #[doc(alias = "random_using")]
    pub fn random_with<R: rand::RngCore + ?Sized>(rng: &mut R) -> Self {
        let mut bytes = Self::ZERO;
        bytes.randomize_with(rng);
        bytes
    }

    /// Tries to create a new [`FixedBytes`] with the given random number generator.
    #[cfg(feature = "rand")]
    #[inline]
    pub fn try_random_with<R: rand::TryRngCore + ?Sized>(rng: &mut R) -> Result<Self, R::Error> {
        let mut bytes = Self::ZERO;
        bytes.try_randomize_with(rng)?;
        Ok(bytes)
    }

    /// Fills this [`FixedBytes`] with the default cryptographic random number generator.
    ///
    /// See [`random`](Self::random) for more details.
    #[cfg(feature = "getrandom")]
    #[inline]
    #[track_caller]
    pub fn randomize(&mut self) {
        self.try_randomize().unwrap_or_else(|e| panic!("failed to fill with random bytes: {e}"));
    }

    /// Tries to fill this [`FixedBytes`] with the default cryptographic random number
    /// generator.
    ///
    /// See [`random`](Self::random) for more details.
    #[inline]
    #[cfg(feature = "getrandom")]
    pub fn try_randomize(&mut self) -> Result<(), getrandom::Error> {
        #[cfg(all(feature = "rand", feature = "std"))]
        {
            self.randomize_with(&mut rand::rng());
            Ok(())
        }
        #[cfg(not(all(feature = "rand", feature = "std")))]
        {
            getrandom::fill(&mut self.0)
        }
    }

    /// Fills this [`FixedBytes`] with the given random number generator.
    #[cfg(feature = "rand")]
    #[inline]
    #[doc(alias = "randomize_using")]
    pub fn randomize_with<R: rand::RngCore + ?Sized>(&mut self, rng: &mut R) {
        rng.fill_bytes(&mut self.0);
    }

    /// Tries to fill this [`FixedBytes`] with the given random number generator.
    #[inline]
    #[cfg(feature = "rand")]
    pub fn try_randomize_with<R: rand::TryRngCore + ?Sized>(
        &mut self,
        rng: &mut R,
    ) -> Result<(), R::Error> {
        rng.try_fill_bytes(&mut self.0)
    }

    /// Concatenate two `FixedBytes`.
    ///
    /// Due to constraints in the language, the user must specify the value of
    /// the output size `Z`.
    ///
    /// # Panics
    ///
    /// Panics if `Z` is not equal to `N + M`.
    pub const fn concat_const<const M: usize, const Z: usize>(
        self,
        other: FixedBytes<M>,
    ) -> FixedBytes<Z> {
        assert!(N + M == Z, "Output size `Z` must equal the sum of the input sizes `N` and `M`");

        let mut result = [0u8; Z];
        let mut i = 0;
        while i < Z {
            result[i] = if i >= N { other.0[i - N] } else { self.0[i] };
            i += 1;
        }
        FixedBytes(result)
    }

    /// Create a new [`FixedBytes`] from the given slice `src`.
    ///
    /// For a fallible version, use the `TryFrom<&[u8]>` implementation.
    ///
    /// # Note
    ///
    /// The given bytes are interpreted in big endian order.
    ///
    /// # Panics
    ///
    /// If the length of `src` and the number of bytes in `Self` do not match.
    #[inline]
    #[track_caller]
    pub fn from_slice(src: &[u8]) -> Self {
        match Self::try_from(src) {
            Ok(x) => x,
            Err(_) => panic!("cannot convert a slice of length {} to FixedBytes<{N}>", src.len()),
        }
    }

    /// Create a new [`FixedBytes`] from the given slice `src`, left-padding it
    /// with zeroes if necessary.
    ///
    /// # Note
    ///
    /// The given bytes are interpreted in big endian order.
    ///
    /// # Panics
    ///
    /// Panics if `src.len() > N`.
    #[inline]
    #[track_caller]
    pub fn left_padding_from(value: &[u8]) -> Self {
        let len = value.len();
        assert!(len <= N, "slice is too large. Expected <={N} bytes, got {len}");
        let mut bytes = Self::ZERO;
        bytes[N - len..].copy_from_slice(value);
        bytes
    }

    /// Create a new [`FixedBytes`] from the given slice `src`, right-padding it
    /// with zeroes if necessary.
    ///
    /// # Note
    ///
    /// The given bytes are interpreted in big endian order.
    ///
    /// # Panics
    ///
    /// Panics if `src.len() > N`.
    #[inline]
    #[track_caller]
    pub fn right_padding_from(value: &[u8]) -> Self {
        let len = value.len();
        assert!(len <= N, "slice is too large. Expected <={N} bytes, got {len}");
        let mut bytes = Self::ZERO;
        bytes[..len].copy_from_slice(value);
        bytes
    }

    /// Returns a slice containing the entire array. Equivalent to `&s[..]`.
    #[inline]
    pub const fn as_slice(&self) -> &[u8] {
        &self.0
    }

    /// Returns a mutable slice containing the entire array. Equivalent to
    /// `&mut s[..]`.
    #[inline]
    pub fn as_mut_slice(&mut self) -> &mut [u8] {
        &mut self.0
    }

    /// Returns `true` if all bits set in `self` are also set in `b`.
    #[inline]
    pub fn covers(&self, other: &Self) -> bool {
        (*self & *other) == *other
    }

    /// Returns `true` if all bits set in `self` are also set in `b`.
    pub const fn const_covers(self, other: Self) -> bool {
        // (self & other) == other
        other.const_eq(&self.bit_and(other))
    }

    /// Compile-time equality. NOT constant-time equality.
    pub const fn const_eq(&self, other: &Self) -> bool {
        let mut i = 0;
        while i < N {
            if self.0[i] != other.0[i] {
                return false;
            }
            i += 1;
        }
        true
    }

    /// Returns `true` if no bits are set.
    #[inline]
    pub fn is_zero(&self) -> bool {
        *self == Self::ZERO
    }

    /// Returns `true` if no bits are set.
    #[inline]
    pub const fn const_is_zero(&self) -> bool {
        self.const_eq(&Self::ZERO)
    }

    /// Computes the bitwise AND of two `FixedBytes`.
    pub const fn bit_and(self, rhs: Self) -> Self {
        let mut ret = Self::ZERO;
        let mut i = 0;
        while i < N {
            ret.0[i] = self.0[i] & rhs.0[i];
            i += 1;
        }
        ret
    }

    /// Computes the bitwise OR of two `FixedBytes`.
    pub const fn bit_or(self, rhs: Self) -> Self {
        let mut ret = Self::ZERO;
        let mut i = 0;
        while i < N {
            ret.0[i] = self.0[i] | rhs.0[i];
            i += 1;
        }
        ret
    }

    /// Computes the bitwise XOR of two `FixedBytes`.
    pub const fn bit_xor(self, rhs: Self) -> Self {
        let mut ret = Self::ZERO;
        let mut i = 0;
        while i < N {
            ret.0[i] = self.0[i] ^ rhs.0[i];
            i += 1;
        }
        ret
    }

    fn fmt_hex<const UPPER: bool>(&self, f: &mut fmt::Formatter<'_>, prefix: bool) -> fmt::Result {
        let mut buf = hex::Buffer::<N, true>::new();
        let s = if UPPER { buf.format_upper(self) } else { buf.format(self) };
        // SAFETY: The buffer is guaranteed to be at least 2 bytes in length.
        f.write_str(unsafe { s.get_unchecked((!prefix as usize) * 2..) })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    macro_rules! test_fmt {
        ($($fmt:literal, $hex:literal => $expected:literal;)+) => {$(
            assert_eq!(
                format!($fmt, fixed_bytes!($hex)),
                $expected
            );
        )+};
    }

    #[test]
    fn concat_const() {
        const A: FixedBytes<2> = fixed_bytes!("0x0123");
        const B: FixedBytes<2> = fixed_bytes!("0x4567");
        const EXPECTED: FixedBytes<4> = fixed_bytes!("0x01234567");
        const ACTUAL: FixedBytes<4> = A.concat_const(B);

        assert_eq!(ACTUAL, EXPECTED);
    }

    #[test]
    fn display() {
        test_fmt! {
            "{}", "0123456789abcdef" => "0x0123456789abcdef";
            "{:#}", "0123" => "0x0123";
            "{:#}", "01234567" => "0x01234567";
            "{:#}", "0123456789" => "0x0123…6789";
        }
    }

    #[test]
    fn debug() {
        test_fmt! {
            "{:?}", "0123456789abcdef" => "0x0123456789abcdef";
            "{:#?}", "0123456789abcdef" => "0x0123456789abcdef";
        }
    }

    #[test]
    fn lower_hex() {
        test_fmt! {
            "{:x}", "0123456789abcdef" => "0123456789abcdef";
            "{:#x}", "0123456789abcdef" => "0x0123456789abcdef";
        }
    }

    #[test]
    fn upper_hex() {
        test_fmt! {
            "{:X}", "0123456789abcdef" => "0123456789ABCDEF";
            "{:#X}", "0123456789abcdef" => "0x0123456789ABCDEF";
        }
    }

    #[test]
    fn left_padding_from() {
        assert_eq!(FixedBytes::<4>::left_padding_from(&[0x01, 0x23]), fixed_bytes!("0x00000123"));

        assert_eq!(
            FixedBytes::<4>::left_padding_from(&[0x01, 0x23, 0x45, 0x67]),
            fixed_bytes!("0x01234567")
        );
    }

    #[test]
    #[should_panic(expected = "slice is too large. Expected <=4 bytes, got 5")]
    fn left_padding_from_too_large() {
        FixedBytes::<4>::left_padding_from(&[0x01, 0x23, 0x45, 0x67, 0x89]);
    }

    #[test]
    fn right_padding_from() {
        assert_eq!(FixedBytes::<4>::right_padding_from(&[0x01, 0x23]), fixed_bytes!("0x01230000"));

        assert_eq!(
            FixedBytes::<4>::right_padding_from(&[0x01, 0x23, 0x45, 0x67]),
            fixed_bytes!("0x01234567")
        );
    }

    #[test]
    #[should_panic(expected = "slice is too large. Expected <=4 bytes, got 5")]
    fn right_padding_from_too_large() {
        FixedBytes::<4>::right_padding_from(&[0x01, 0x23, 0x45, 0x67, 0x89]);
    }
}
```
```rs [./src/bits/serde.rs]
use super::FixedBytes;
use core::fmt;
use serde::{
    de::{self, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};

impl<const N: usize> Serialize for FixedBytes<N> {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        if serializer.is_human_readable() {
            let mut buf = hex::Buffer::<N, true>::new();
            serializer.serialize_str(buf.format(&self.0))
        } else {
            serializer.serialize_bytes(self.as_slice())
        }
    }
}

impl<'de, const N: usize> Deserialize<'de> for FixedBytes<N> {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        struct FixedVisitor<const N: usize>;

        impl<'de, const N: usize> Visitor<'de> for FixedVisitor<N> {
            type Value = FixedBytes<N>;

            fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                write!(
                    formatter,
                    "{} bytes, represented as a hex string of length {}, an array of u8, or raw bytes",
                    N,
                    N * 2
                )
            }

            fn visit_bytes<E: de::Error>(self, v: &[u8]) -> Result<Self::Value, E> {
                FixedBytes::try_from(v).map_err(de::Error::custom)
            }

            fn visit_seq<A: de::SeqAccess<'de>>(self, mut seq: A) -> Result<Self::Value, A::Error> {
                let len_error =
                    |i| de::Error::invalid_length(i, &format!("exactly {N} bytes").as_str());
                let mut bytes = [0u8; N];

                for (i, byte) in bytes.iter_mut().enumerate() {
                    *byte = seq.next_element()?.ok_or_else(|| len_error(i))?;
                }

                if let Ok(Some(_)) = seq.next_element::<u8>() {
                    return Err(len_error(N + 1));
                }

                Ok(FixedBytes(bytes))
            }

            fn visit_str<E: de::Error>(self, v: &str) -> Result<Self::Value, E> {
                <FixedBytes<N> as hex::FromHex>::from_hex(v).map_err(de::Error::custom)
            }
        }

        if deserializer.is_human_readable() {
            deserializer.deserialize_any(FixedVisitor::<N>)
        } else {
            deserializer.deserialize_bytes(FixedVisitor::<N>)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloc::string::ToString;
    use serde::Deserialize;

    #[derive(Debug, Deserialize)]
    struct TestCase<const N: usize> {
        fixed: FixedBytes<N>,
    }

    #[test]
    fn serde() {
        let bytes = FixedBytes([0, 0, 0, 0, 1, 35, 69, 103, 137, 171, 205, 239]);
        let ser = serde_json::to_string(&bytes).unwrap();
        assert_eq!(ser, "\"0x000000000123456789abcdef\"");
        assert_eq!(serde_json::from_str::<FixedBytes<12>>(&ser).unwrap(), bytes);

        let val = serde_json::to_value(bytes).unwrap();
        assert_eq!(val, serde_json::json! {"0x000000000123456789abcdef"});
        assert_eq!(serde_json::from_value::<FixedBytes<12>>(val).unwrap(), bytes);
    }

    #[test]
    fn serde_num_array() {
        let json = serde_json::json! {{"fixed": [0,1,2,3,4]}};

        assert_eq!(
            serde_json::from_value::<TestCase<5>>(json.clone()).unwrap().fixed,
            FixedBytes([0, 1, 2, 3, 4])
        );

        let e = serde_json::from_value::<TestCase<4>>(json).unwrap_err();
        let es = e.to_string();
        assert!(es.contains("invalid length 5, expected exactly 4 bytes"), "{es}");
    }

    #[test]
    fn test_bincode_roundtrip() {
        let bytes = FixedBytes([0, 0, 0, 0, 1, 35, 69, 103, 137, 171, 205, 239]);

        let bin = bincode::serialize(&bytes).unwrap();
        assert_eq!(bincode::deserialize::<FixedBytes<12>>(&bin).unwrap(), bytes);
    }
}
```
```rs [./src/bits/rlp.rs]
use super::FixedBytes;
use alloy_rlp::{length_of_length, Decodable, Encodable, MaxEncodedLen, MaxEncodedLenAssoc};

impl<const N: usize> Decodable for FixedBytes<N> {
    #[inline]
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self> {
        Decodable::decode(buf).map(Self)
    }
}

impl<const N: usize> Encodable for FixedBytes<N> {
    #[inline]
    fn length(&self) -> usize {
        self.0.length()
    }

    #[inline]
    fn encode(&self, out: &mut dyn bytes::BufMut) {
        self.0.encode(out);
    }
}

// cannot implement this with const generics due to Rust issue #76560:
// https://github.com/rust-lang/rust/issues/76560
macro_rules! fixed_bytes_max_encoded_len {
    ($($sz:literal),+) => {$(
        unsafe impl MaxEncodedLen<{ $sz + length_of_length($sz) }> for FixedBytes<$sz> {}
    )+};
}

fixed_bytes_max_encoded_len!(0, 1, 2, 4, 8, 16, 20, 32, 64, 128, 256, 512, 1024);

unsafe impl<const N: usize> MaxEncodedLenAssoc for FixedBytes<N> {
    const LEN: usize = N + length_of_length(N);
}
```
```rs [./src/bits/address.rs]
use crate::{aliases::U160, utils::keccak256, FixedBytes};
use alloc::{
    borrow::Borrow,
    string::{String, ToString},
};
use core::{fmt, mem::MaybeUninit, str};

/// Error type for address checksum validation.
#[derive(Clone, Copy, Debug)]
pub enum AddressError {
    /// Error while decoding hex.
    Hex(hex::FromHexError),

    /// Invalid ERC-55 checksum.
    InvalidChecksum,
}

impl From<hex::FromHexError> for AddressError {
    #[inline]
    fn from(value: hex::FromHexError) -> Self {
        Self::Hex(value)
    }
}

impl core::error::Error for AddressError {
    #[inline]
    fn source(&self) -> Option<&(dyn core::error::Error + 'static)> {
        match self {
            #[cfg(any(feature = "std", not(feature = "hex-compat")))]
            Self::Hex(err) => Some(err),
            _ => None,
        }
    }
}

impl fmt::Display for AddressError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Hex(err) => err.fmt(f),
            Self::InvalidChecksum => f.write_str("Bad address checksum"),
        }
    }
}

wrap_fixed_bytes!(
    // we implement Display with the checksum, so we don't derive it
    extra_derives: [],
    /// An Ethereum address, 20 bytes in length.
    ///
    /// This type is separate from [`B160`](crate::B160) / [`FixedBytes<20>`]
    /// and is declared with the [`wrap_fixed_bytes!`] macro. This allows us
    /// to implement address-specific functionality.
    ///
    /// The main difference with the generic [`FixedBytes`] implementation is that
    /// [`Display`] formats the address using its [EIP-55] checksum
    /// ([`to_checksum`]).
    /// Use [`Debug`] to display the raw bytes without the checksum.
    ///
    /// [EIP-55]: https://eips.ethereum.org/EIPS/eip-55
    /// [`Debug`]: fmt::Debug
    /// [`Display`]: fmt::Display
    /// [`to_checksum`]: Address::to_checksum
    ///
    /// # Examples
    ///
    /// Parsing and formatting:
    ///
    /// ```
    /// use alloy_primitives::{address, Address};
    ///
    /// let checksummed = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    /// let expected = address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    /// let address = Address::parse_checksummed(checksummed, None).expect("valid checksum");
    /// assert_eq!(address, expected);
    ///
    /// // Format the address with the checksum
    /// assert_eq!(address.to_string(), checksummed);
    /// assert_eq!(address.to_checksum(None), checksummed);
    ///
    /// // Format the compressed checksummed address
    /// assert_eq!(format!("{address:#}"), "0xd8dA…6045");
    ///
    /// // Format the address without the checksum
    /// assert_eq!(format!("{address:?}"), "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    /// ```
    pub struct Address<20>;
);

impl From<U160> for Address {
    #[inline]
    fn from(value: U160) -> Self {
        Self(FixedBytes(value.to_be_bytes()))
    }
}

impl From<Address> for U160 {
    #[inline]
    fn from(value: Address) -> Self {
        Self::from_be_bytes(value.0 .0)
    }
}

impl fmt::Display for Address {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let checksum = self.to_checksum_buffer(None);
        let checksum = checksum.as_str();
        if f.alternate() {
            // If the alternate flag is set, use middle-out compression
            // "0x" + first 4 bytes + "…" + last 4 bytes
            f.write_str(&checksum[..6])?;
            f.write_str("…")?;
            f.write_str(&checksum[38..])
        } else {
            f.write_str(checksum)
        }
    }
}

impl Address {
    /// Creates an Ethereum address from an EVM word's upper 20 bytes
    /// (`word[12..]`).
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, b256, Address};
    /// let word = b256!("0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045");
    /// assert_eq!(Address::from_word(word), address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045"));
    /// ```
    #[inline]
    #[must_use]
    pub fn from_word(word: FixedBytes<32>) -> Self {
        Self(FixedBytes(word[12..].try_into().unwrap()))
    }

    /// Left-pads the address to 32 bytes (EVM word size).
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, b256, Address};
    /// assert_eq!(
    ///     address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045").into_word(),
    ///     b256!("0x000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045"),
    /// );
    /// ```
    #[inline]
    #[must_use]
    pub fn into_word(&self) -> FixedBytes<32> {
        let mut word = [0; 32];
        word[12..].copy_from_slice(self.as_slice());
        FixedBytes(word)
    }

    /// Parse an Ethereum address, verifying its [EIP-55] checksum.
    ///
    /// You can optionally specify an [EIP-155 chain ID] to check the address
    /// using [EIP-1191].
    ///
    /// [EIP-55]: https://eips.ethereum.org/EIPS/eip-55
    /// [EIP-155 chain ID]: https://eips.ethereum.org/EIPS/eip-155
    /// [EIP-1191]: https://eips.ethereum.org/EIPS/eip-1191
    ///
    /// # Errors
    ///
    /// This method returns an error if the provided string does not match the
    /// expected checksum.
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, Address};
    /// let checksummed = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    /// let address = Address::parse_checksummed(checksummed, None).unwrap();
    /// let expected = address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    /// assert_eq!(address, expected);
    /// ```
    pub fn parse_checksummed<S: AsRef<str>>(
        s: S,
        chain_id: Option<u64>,
    ) -> Result<Self, AddressError> {
        fn parse_checksummed(s: &str, chain_id: Option<u64>) -> Result<Address, AddressError> {
            // checksummed addresses always start with the "0x" prefix
            if !s.starts_with("0x") {
                return Err(AddressError::Hex(hex::FromHexError::InvalidStringLength));
            }

            let address: Address = s.parse()?;
            if s == address.to_checksum_buffer(chain_id).as_str() {
                Ok(address)
            } else {
                Err(AddressError::InvalidChecksum)
            }
        }

        parse_checksummed(s.as_ref(), chain_id)
    }

    /// Encodes an Ethereum address to its [EIP-55] checksum into a heap-allocated string.
    ///
    /// You can optionally specify an [EIP-155 chain ID] to encode the address
    /// using [EIP-1191].
    ///
    /// [EIP-55]: https://eips.ethereum.org/EIPS/eip-55
    /// [EIP-155 chain ID]: https://eips.ethereum.org/EIPS/eip-155
    /// [EIP-1191]: https://eips.ethereum.org/EIPS/eip-1191
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, Address};
    /// let address = address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    ///
    /// let checksummed: String = address.to_checksum(None);
    /// assert_eq!(checksummed, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    ///
    /// let checksummed: String = address.to_checksum(Some(1));
    /// assert_eq!(checksummed, "0xD8Da6bf26964Af9d7EEd9e03e53415d37AA96045");
    /// ```
    #[inline]
    #[must_use]
    pub fn to_checksum(&self, chain_id: Option<u64>) -> String {
        self.to_checksum_buffer(chain_id).as_str().into()
    }

    /// Encodes an Ethereum address to its [EIP-55] checksum into the given buffer.
    ///
    /// For convenience, the buffer is returned as a `&mut str`, as the bytes
    /// are guaranteed to be valid UTF-8.
    ///
    /// You can optionally specify an [EIP-155 chain ID] to encode the address
    /// using [EIP-1191].
    ///
    /// [EIP-55]: https://eips.ethereum.org/EIPS/eip-55
    /// [EIP-155 chain ID]: https://eips.ethereum.org/EIPS/eip-155
    /// [EIP-1191]: https://eips.ethereum.org/EIPS/eip-1191
    ///
    /// # Panics
    ///
    /// Panics if `buf` is not exactly 42 bytes long.
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, Address};
    /// let address = address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    /// let mut buf = [0; 42];
    ///
    /// let checksummed: &mut str = address.to_checksum_raw(&mut buf, None);
    /// assert_eq!(checksummed, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    ///
    /// let checksummed: &mut str = address.to_checksum_raw(&mut buf, Some(1));
    /// assert_eq!(checksummed, "0xD8Da6bf26964Af9d7EEd9e03e53415d37AA96045");
    /// ```
    #[inline]
    #[must_use]
    pub fn to_checksum_raw<'a>(&self, buf: &'a mut [u8], chain_id: Option<u64>) -> &'a mut str {
        let buf: &mut [u8; 42] = buf.try_into().expect("buffer must be exactly 42 bytes long");
        self.to_checksum_inner(buf, chain_id);
        // SAFETY: All bytes in the buffer are valid UTF-8.
        unsafe { str::from_utf8_unchecked_mut(buf) }
    }

    /// Encodes an Ethereum address to its [EIP-55] checksum into a stack-allocated buffer.
    ///
    /// You can optionally specify an [EIP-155 chain ID] to encode the address
    /// using [EIP-1191].
    ///
    /// [EIP-55]: https://eips.ethereum.org/EIPS/eip-55
    /// [EIP-155 chain ID]: https://eips.ethereum.org/EIPS/eip-155
    /// [EIP-1191]: https://eips.ethereum.org/EIPS/eip-1191
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, Address, AddressChecksumBuffer};
    /// let address = address!("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    ///
    /// let mut buffer: AddressChecksumBuffer = address.to_checksum_buffer(None);
    /// assert_eq!(buffer.as_str(), "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
    ///
    /// let checksummed: &str = buffer.format(&address, Some(1));
    /// assert_eq!(checksummed, "0xD8Da6bf26964Af9d7EEd9e03e53415d37AA96045");
    /// ```
    #[inline]
    pub fn to_checksum_buffer(&self, chain_id: Option<u64>) -> AddressChecksumBuffer {
        // SAFETY: The buffer is initialized by `format`.
        let mut buf = unsafe { AddressChecksumBuffer::new() };
        buf.format(self, chain_id);
        buf
    }

    // https://eips.ethereum.org/EIPS/eip-55
    // > In English, convert the address to hex, but if the `i`th digit is a letter (ie. it’s one of
    // > `abcdef`) print it in uppercase if the `4*i`th bit of the hash of the lowercase hexadecimal
    // > address is 1 otherwise print it in lowercase.
    //
    // https://eips.ethereum.org/EIPS/eip-1191
    // > [...] If the chain id passed to the function belongs to a network that opted for using this
    // > checksum variant, prefix the address with the chain id and the `0x` separator before
    // > calculating the hash. [...]
    #[allow(clippy::wrong_self_convention)]
    fn to_checksum_inner(&self, buf: &mut [u8; 42], chain_id: Option<u64>) {
        buf[0] = b'0';
        buf[1] = b'x';
        hex::encode_to_slice(self, &mut buf[2..]).unwrap();

        let mut hasher = crate::Keccak256::new();
        match chain_id {
            Some(chain_id) => {
                hasher.update(itoa::Buffer::new().format(chain_id).as_bytes());
                // Clippy suggests an unnecessary copy.
                #[allow(clippy::needless_borrows_for_generic_args)]
                hasher.update(&*buf);
            }
            None => hasher.update(&buf[2..]),
        }
        let hash = hasher.finalize();

        for (i, out) in buf[2..].iter_mut().enumerate() {
            // This is made branchless for easier vectorization.
            // Get the i-th nibble of the hash.
            let hash_nibble = (hash[i / 2] >> (4 * (1 - i % 2))) & 0xf;
            // Make the character ASCII uppercase if it's a hex letter and the hash nibble is >= 8.
            // We can use a simpler comparison for checking if the character is a hex letter because
            // we know `out` is a hex-encoded character (`b'0'..=b'9' | b'a'..=b'f'`).
            *out ^= 0b0010_0000 * ((*out >= b'a') & (hash_nibble >= 8)) as u8;
        }
    }

    /// Computes the `create` address for this address and nonce:
    ///
    /// `keccak256(rlp([sender, nonce]))[12:]`
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, Address};
    /// let sender = address!("0xb20a608c624Ca5003905aA834De7156C68b2E1d0");
    ///
    /// let expected = address!("0x00000000219ab540356cBB839Cbe05303d7705Fa");
    /// assert_eq!(sender.create(0), expected);
    ///
    /// let expected = address!("0xe33c6e89e69d085897f98e92b06ebd541d1daa99");
    /// assert_eq!(sender.create(1), expected);
    /// ```
    #[cfg(feature = "rlp")]
    #[inline]
    #[must_use]
    pub fn create(&self, nonce: u64) -> Self {
        use alloy_rlp::{Encodable, EMPTY_LIST_CODE, EMPTY_STRING_CODE};

        // max u64 encoded length is `1 + u64::BYTES`
        const MAX_LEN: usize = 1 + (1 + 20) + 9;

        let len = 22 + nonce.length();
        debug_assert!(len <= MAX_LEN);

        let mut out = [0u8; MAX_LEN];

        // list header
        // minus 1 to account for the list header itself
        out[0] = EMPTY_LIST_CODE + len as u8 - 1;

        // address header + address
        out[1] = EMPTY_STRING_CODE + 20;
        out[2..22].copy_from_slice(self.as_slice());

        // nonce
        nonce.encode(&mut &mut out[22..]);

        let hash = keccak256(&out[..len]);
        Self::from_word(hash)
    }

    /// Computes the `CREATE2` address of a smart contract as specified in
    /// [EIP-1014]:
    ///
    /// `keccak256(0xff ++ address ++ salt ++ keccak256(init_code))[12:]`
    ///
    /// The `init_code` is the code that, when executed, produces the runtime
    /// bytecode that will be placed into the state, and which typically is used
    /// by high level languages to implement a ‘constructor’.
    ///
    /// [EIP-1014]: https://eips.ethereum.org/EIPS/eip-1014
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, b256, bytes, Address};
    /// let address = address!("0x8ba1f109551bD432803012645Ac136ddd64DBA72");
    /// let salt = b256!("0x7c5ea36004851c764c44143b1dcb59679b11c9a68e5f41497f6cf3d480715331");
    /// let init_code = bytes!("6394198df16000526103ff60206004601c335afa6040516060f3");
    /// let expected = address!("0x533ae9d683B10C02EbDb05471642F85230071FC3");
    /// assert_eq!(address.create2_from_code(salt, init_code), expected);
    /// ```
    #[must_use]
    pub fn create2_from_code<S, C>(&self, salt: S, init_code: C) -> Self
    where
        // not `AsRef` because `[u8; N]` does not implement `AsRef<[u8; N]>`
        S: Borrow<[u8; 32]>,
        C: AsRef<[u8]>,
    {
        self._create2(salt.borrow(), &keccak256(init_code.as_ref()).0)
    }

    /// Computes the `CREATE2` address of a smart contract as specified in
    /// [EIP-1014], taking the pre-computed hash of the init code as input:
    ///
    /// `keccak256(0xff ++ address ++ salt ++ init_code_hash)[12:]`
    ///
    /// The `init_code` is the code that, when executed, produces the runtime
    /// bytecode that will be placed into the state, and which typically is used
    /// by high level languages to implement a ‘constructor’.
    ///
    /// [EIP-1014]: https://eips.ethereum.org/EIPS/eip-1014
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, b256, Address};
    /// let address = address!("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
    /// let salt = b256!("0x2b2f5776e38002e0c013d0d89828fdb06fee595ea2d5ed4b194e3883e823e350");
    /// let init_code_hash =
    ///     b256!("0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f");
    /// let expected = address!("0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852");
    /// assert_eq!(address.create2(salt, init_code_hash), expected);
    /// ```
    #[must_use]
    pub fn create2<S, H>(&self, salt: S, init_code_hash: H) -> Self
    where
        // not `AsRef` because `[u8; N]` does not implement `AsRef<[u8; N]>`
        S: Borrow<[u8; 32]>,
        H: Borrow<[u8; 32]>,
    {
        self._create2(salt.borrow(), init_code_hash.borrow())
    }

    // non-generic inner function
    fn _create2(&self, salt: &[u8; 32], init_code_hash: &[u8; 32]) -> Self {
        // note: creating a temporary buffer and copying everything over performs
        // much better than calling `Keccak::update` multiple times
        let mut bytes = [0; 85];
        bytes[0] = 0xff;
        bytes[1..21].copy_from_slice(self.as_slice());
        bytes[21..53].copy_from_slice(salt);
        bytes[53..85].copy_from_slice(init_code_hash);
        let hash = keccak256(bytes);
        Self::from_word(hash)
    }

    /// Computes the address created by the `EOFCREATE` opcode, where `self` is the sender.
    ///
    /// The address is calculated as `keccak256(0xff || sender32 || salt)[12:]`, where sender32 is
    /// the sender address left-padded to 32 bytes with zeros.
    ///
    /// See [EIP-7620](https://eips.ethereum.org/EIPS/eip-7620) for more details.
    ///
    /// <div class="warning">
    /// This function's stability is not guaranteed. It may change in the future as the EIP is
    /// not yet accepted.
    /// </div>
    ///
    /// # Examples
    ///
    /// ```
    /// # use alloy_primitives::{address, b256, Address};
    /// let address = address!("0xb20a608c624Ca5003905aA834De7156C68b2E1d0");
    /// let salt = b256!("0x7c5ea36004851c764c44143b1dcb59679b11c9a68e5f41497f6cf3d480715331");
    /// // Create an address using CREATE_EOF
    /// let eof_address = address.create_eof(salt);
    /// ```
    #[must_use]
    #[doc(alias = "eof_create")]
    pub fn create_eof<S>(&self, salt: S) -> Self
    where
        // not `AsRef` because `[u8; N]` does not implement `AsRef<[u8; N]>`
        S: Borrow<[u8; 32]>,
    {
        self._create_eof(salt.borrow())
    }

    // non-generic inner function
    fn _create_eof(&self, salt: &[u8; 32]) -> Self {
        let mut buffer = [0; 65];
        buffer[0] = 0xff;
        // 1..13 is zero pad (already initialized to 0)
        buffer[13..33].copy_from_slice(self.as_slice());
        buffer[33..].copy_from_slice(salt);
        Self::from_word(keccak256(buffer))
    }

    /// Instantiate by hashing public key bytes.
    ///
    /// # Panics
    ///
    /// If the input is not exactly 64 bytes
    pub fn from_raw_public_key(pubkey: &[u8]) -> Self {
        assert_eq!(pubkey.len(), 64, "raw public key must be 64 bytes");
        let digest = keccak256(pubkey);
        Self::from_slice(&digest[12..])
    }

    /// Converts an ECDSA verifying key to its corresponding Ethereum address.
    #[inline]
    #[cfg(feature = "k256")]
    #[doc(alias = "from_verifying_key")]
    pub fn from_public_key(pubkey: &k256::ecdsa::VerifyingKey) -> Self {
        use k256::elliptic_curve::sec1::ToEncodedPoint;
        let affine: &k256::AffinePoint = pubkey.as_ref();
        let encoded = affine.to_encoded_point(false);
        Self::from_raw_public_key(&encoded.as_bytes()[1..])
    }

    /// Converts an ECDSA signing key to its corresponding Ethereum address.
    #[inline]
    #[cfg(feature = "k256")]
    #[doc(alias = "from_signing_key")]
    pub fn from_private_key(private_key: &k256::ecdsa::SigningKey) -> Self {
        Self::from_public_key(private_key.verifying_key())
    }
}

/// Stack-allocated buffer for efficiently computing address checksums.
///
/// See [`Address::to_checksum_buffer`] for more information.
#[must_use]
#[allow(missing_copy_implementations)]
#[derive(Clone)]
pub struct AddressChecksumBuffer(MaybeUninit<[u8; 42]>);

impl fmt::Debug for AddressChecksumBuffer {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.as_str().fmt(f)
    }
}

impl fmt::Display for AddressChecksumBuffer {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.as_str().fmt(f)
    }
}

impl AddressChecksumBuffer {
    /// Creates a new buffer.
    ///
    /// # Safety
    ///
    /// The buffer must be initialized with [`format`](Self::format) before use.
    /// Prefer [`Address::to_checksum_buffer`] instead.
    #[inline]
    pub const unsafe fn new() -> Self {
        Self(MaybeUninit::uninit())
    }

    /// Calculates the checksum of an address into the buffer.
    ///
    /// See [`Address::to_checksum_buffer`] for more information.
    #[inline]
    pub fn format(&mut self, address: &Address, chain_id: Option<u64>) -> &mut str {
        address.to_checksum_inner(unsafe { self.0.assume_init_mut() }, chain_id);
        self.as_mut_str()
    }

    /// Returns the checksum of a formatted address.
    #[inline]
    pub const fn as_str(&self) -> &str {
        unsafe { str::from_utf8_unchecked(self.0.assume_init_ref()) }
    }

    /// Returns the checksum of a formatted address.
    #[inline]
    pub fn as_mut_str(&mut self) -> &mut str {
        unsafe { str::from_utf8_unchecked_mut(self.0.assume_init_mut()) }
    }

    /// Returns the checksum of a formatted address.
    #[inline]
    #[allow(clippy::inherent_to_string_shadow_display)]
    pub fn to_string(&self) -> String {
        self.as_str().to_string()
    }

    /// Returns the backing buffer.
    #[inline]
    pub const fn into_inner(self) -> [u8; 42] {
        unsafe { self.0.assume_init() }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hex;

    #[test]
    fn parse() {
        let expected = hex!("0102030405060708090a0b0c0d0e0f1011121314");
        assert_eq!(
            "0102030405060708090a0b0c0d0e0f1011121314".parse::<Address>().unwrap().into_array(),
            expected
        );
        assert_eq!(
            "0x0102030405060708090a0b0c0d0e0f1011121314".parse::<Address>().unwrap(),
            expected
        );
    }

    // https://eips.ethereum.org/EIPS/eip-55
    #[test]
    fn checksum() {
        let addresses = [
            // All caps
            "0x52908400098527886E0F7030069857D2E4169EE7",
            "0x8617E340B3D01FA5F11F306F4090FD50E238070D",
            // All Lower
            "0xde709f2102306220921060314715629080e2fb77",
            "0x27b1fdb04752bbc536007a920d24acb045561c26",
            // Normal
            "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
            "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
            "0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB",
            "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
        ];
        for addr in addresses {
            let parsed1: Address = addr.parse().unwrap();
            let parsed2 = Address::parse_checksummed(addr, None).unwrap();
            assert_eq!(parsed1, parsed2);
            assert_eq!(parsed2.to_checksum(None), addr);
        }
    }

    // https://eips.ethereum.org/EIPS/eip-1191
    #[test]
    fn checksum_chain_id() {
        let eth_mainnet = [
            "0x27b1fdb04752bbc536007a920d24acb045561c26",
            "0x3599689E6292b81B2d85451025146515070129Bb",
            "0x42712D45473476b98452f434e72461577D686318",
            "0x52908400098527886E0F7030069857D2E4169EE7",
            "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
            "0x6549f4939460DE12611948b3f82b88C3C8975323",
            "0x66f9664f97F2b50F62D13eA064982f936dE76657",
            "0x8617E340B3D01FA5F11F306F4090FD50E238070D",
            "0x88021160C5C792225E4E5452585947470010289D",
            "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb",
            "0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB",
            "0xde709f2102306220921060314715629080e2fb77",
            "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
        ];
        let rsk_mainnet = [
            "0x27b1FdB04752BBc536007A920D24ACB045561c26",
            "0x3599689E6292B81B2D85451025146515070129Bb",
            "0x42712D45473476B98452f434E72461577d686318",
            "0x52908400098527886E0F7030069857D2E4169ee7",
            "0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD",
            "0x6549F4939460DE12611948B3F82B88C3C8975323",
            "0x66F9664f97f2B50F62d13EA064982F936de76657",
            "0x8617E340b3D01Fa5f11f306f4090fd50E238070D",
            "0x88021160c5C792225E4E5452585947470010289d",
            "0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB",
            "0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB",
            "0xDe709F2102306220921060314715629080e2FB77",
            "0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359",
        ];
        let rsk_testnet = [
            "0x27B1FdB04752BbC536007a920D24acB045561C26",
            "0x3599689e6292b81b2D85451025146515070129Bb",
            "0x42712D45473476B98452F434E72461577D686318",
            "0x52908400098527886E0F7030069857D2e4169EE7",
            "0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd",
            "0x6549f4939460dE12611948b3f82b88C3c8975323",
            "0x66f9664F97F2b50f62d13eA064982F936DE76657",
            "0x8617e340b3D01fa5F11f306F4090Fd50e238070d",
            "0x88021160c5C792225E4E5452585947470010289d",
            "0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB",
            "0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB",
            "0xDE709F2102306220921060314715629080e2Fb77",
            "0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359",
        ];
        for (addresses, chain_id) in [(eth_mainnet, 1), (rsk_mainnet, 30), (rsk_testnet, 31)] {
            // EIP-1191 test cases treat mainnet as "not adopted"
            let id = if chain_id == 1 { None } else { Some(chain_id) };
            for addr in addresses {
                let parsed1: Address = addr.parse().unwrap();
                let parsed2 = Address::parse_checksummed(addr, id).unwrap();
                assert_eq!(parsed1, parsed2);
                assert_eq!(parsed2.to_checksum(id), addr);
            }
        }
    }

    // https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed
    #[test]
    #[cfg(feature = "rlp")]
    fn create() {
        let from = "0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0".parse::<Address>().unwrap();
        for (nonce, expected) in [
            "0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d",
            "0x343c43a37d37dff08ae8c4a11544c718abb4fcf8",
            "0xf778b86fa74e846c4f0a1fbd1335fe81c00a0c91",
            "0xfffd933a0bc612844eaf0c6fe3e5b8e9b6c1d19c",
        ]
        .into_iter()
        .enumerate()
        {
            let address = from.create(nonce as u64);
            assert_eq!(address, expected.parse::<Address>().unwrap());
        }
    }

    #[test]
    #[cfg(all(feature = "rlp", feature = "arbitrary"))]
    #[cfg_attr(miri, ignore = "doesn't run in isolation and would take too long")]
    fn create_correctness() {
        fn create_slow(address: &Address, nonce: u64) -> Address {
            use alloy_rlp::Encodable;

            let mut out = vec![];

            alloy_rlp::Header { list: true, payload_length: address.length() + nonce.length() }
                .encode(&mut out);
            address.encode(&mut out);
            nonce.encode(&mut out);

            Address::from_word(keccak256(out))
        }

        proptest::proptest!(|(address: Address, nonce: u64)| {
            proptest::prop_assert_eq!(address.create(nonce), create_slow(&address, nonce));
        });
    }

    // https://eips.ethereum.org/EIPS/eip-1014
    #[test]
    fn create2() {
        let tests = [
            (
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "00",
                "4D1A2e2bB4F88F0250f26Ffff098B0b30B26BF38",
            ),
            (
                "deadbeef00000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "00",
                "B928f69Bb1D91Cd65274e3c79d8986362984fDA3",
            ),
            (
                "deadbeef00000000000000000000000000000000",
                "000000000000000000000000feed000000000000000000000000000000000000",
                "00",
                "D04116cDd17beBE565EB2422F2497E06cC1C9833",
            ),
            (
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "deadbeef",
                "70f2b2914A2a4b783FaEFb75f459A580616Fcb5e",
            ),
            (
                "00000000000000000000000000000000deadbeef",
                "00000000000000000000000000000000000000000000000000000000cafebabe",
                "deadbeef",
                "60f3f640a8508fC6a86d45DF051962668E1e8AC7",
            ),
            (
                "00000000000000000000000000000000deadbeef",
                "00000000000000000000000000000000000000000000000000000000cafebabe",
                "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
                "1d8bfDC5D46DC4f61D6b6115972536eBE6A8854C",
            ),
            (
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "",
                "E33C0C7F7df4809055C3ebA6c09CFe4BaF1BD9e0",
            ),
        ];
        for (from, salt, init_code, expected) in tests {
            let from = from.parse::<Address>().unwrap();

            let salt = hex::decode(salt).unwrap();
            let salt: [u8; 32] = salt.try_into().unwrap();

            let init_code = hex::decode(init_code).unwrap();
            let init_code_hash = keccak256(&init_code);

            let expected = expected.parse::<Address>().unwrap();

            assert_eq!(expected, from.create2(salt, init_code_hash));
            assert_eq!(expected, from.create2_from_code(salt, init_code));
        }
    }

    #[test]
    fn create_eof() {
        // Test cases with (from_address, salt, expected_result)
        let tests = [
            (
                "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "02b6826e9392ee6bf6479e413c570846ab0107ec",
            ),
            (
                "0000000000000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "47f3f8F550f58348651C4c3E8cCD414b35d2E9fC",
            ),
            (
                "deadbeef00000000000000000000000000000000",
                "0000000000000000000000000000000000000000000000000000000000000000",
                "D146E87a5EA438103eF31cB75B432EecF0c855cc",
            ),
        ];

        for (from, salt, expected) in tests {
            let from = from.parse::<Address>().unwrap();

            let salt = hex::decode(salt).unwrap();
            let salt: [u8; 32] = salt.try_into().unwrap();

            let expected = expected.parse::<Address>().unwrap();

            assert_eq!(expected, from.create_eof(salt));
        }
    }

    #[test]
    fn test_raw_public_key_to_address() {
        let addr = "0Ac1dF02185025F65202660F8167210A80dD5086".parse::<Address>().unwrap();

        let pubkey_bytes = hex::decode("76698beebe8ee5c74d8cc50ab84ac301ee8f10af6f28d0ffd6adf4d6d3b9b762d46ca56d3dad2ce13213a6f42278dabbb53259f2d92681ea6a0b98197a719be3").unwrap();

        assert_eq!(Address::from_raw_public_key(&pubkey_bytes), addr);
    }
}
```
```rs [./src/bits/mod.rs]
#[macro_use]
mod macros;

mod address;
pub use address::{Address, AddressChecksumBuffer, AddressError};

mod bloom;
pub use bloom::{Bloom, BloomInput, BLOOM_BITS_PER_ITEM, BLOOM_SIZE_BITS, BLOOM_SIZE_BYTES};

mod fixed;
pub use fixed::FixedBytes;

mod function;
pub use function::Function;

#[cfg(feature = "rlp")]
mod rlp;

#[cfg(feature = "serde")]
mod serde;
```
```rs [./src/bits/bloom.rs]
//! Bloom type.
//!
//! Adapted from <https://github.com/paritytech/parity-common/blob/2fb72eea96b6de4a085144ce239feb49da0cd39e/ethbloom/src/lib.rs>

use crate::{keccak256, Address, Log, LogData, B256};

/// Number of bits to set per input in Ethereum bloom filter.
pub const BLOOM_BITS_PER_ITEM: usize = 3;
/// Size of the bloom filter in bytes.
pub const BLOOM_SIZE_BYTES: usize = 256;
/// Size of the bloom filter in bits
pub const BLOOM_SIZE_BITS: usize = BLOOM_SIZE_BYTES * 8;

/// Mask, used in accrue
const MASK: usize = BLOOM_SIZE_BITS - 1;
/// Number of bytes per item, used in accrue
const ITEM_BYTES: usize = BLOOM_SIZE_BITS.ilog2().div_ceil(8) as usize;

// BLOOM_SIZE_BYTES must be a power of 2
#[allow(clippy::assertions_on_constants)]
const _: () = assert!(BLOOM_SIZE_BYTES.is_power_of_two());

/// Input to the [`Bloom::accrue`] method.
#[derive(Clone, Copy, Debug)]
pub enum BloomInput<'a> {
    /// Raw input to be hashed.
    Raw(&'a [u8]),
    /// Already hashed input.
    Hash(B256),
}

impl BloomInput<'_> {
    /// Consume the input, converting it to the hash.
    #[inline]
    pub fn into_hash(self) -> B256 {
        match self {
            BloomInput::Raw(raw) => keccak256(raw),
            BloomInput::Hash(hash) => hash,
        }
    }
}

impl From<BloomInput<'_>> for Bloom {
    #[inline]
    fn from(input: BloomInput<'_>) -> Self {
        let mut bloom = Self::ZERO;
        bloom.accrue(input);
        bloom
    }
}

wrap_fixed_bytes!(
    /// Ethereum 256 byte bloom filter.
    pub struct Bloom<256>;
);

impl<'a> FromIterator<&'a (Address, LogData)> for Bloom {
    fn from_iter<T: IntoIterator<Item = &'a (Address, LogData)>>(iter: T) -> Self {
        let mut bloom = Self::ZERO;
        bloom.extend(iter);
        bloom
    }
}

impl<'a> Extend<&'a (Address, LogData)> for Bloom {
    fn extend<T: IntoIterator<Item = &'a (Address, LogData)>>(&mut self, iter: T) {
        for (address, log_data) in iter {
            self.accrue_raw_log(*address, log_data.topics())
        }
    }
}

impl<'a> FromIterator<&'a Log> for Bloom {
    #[inline]
    fn from_iter<T: IntoIterator<Item = &'a Log>>(logs: T) -> Self {
        let mut bloom = Self::ZERO;
        bloom.extend(logs);
        bloom
    }
}

impl<'a> Extend<&'a Log> for Bloom {
    #[inline]
    fn extend<T: IntoIterator<Item = &'a Log>>(&mut self, logs: T) {
        for log in logs {
            self.accrue_log(log)
        }
    }
}

impl<'a, 'b> FromIterator<&'a BloomInput<'b>> for Bloom {
    #[inline]
    fn from_iter<T: IntoIterator<Item = &'a BloomInput<'b>>>(inputs: T) -> Self {
        let mut bloom = Self::ZERO;
        bloom.extend(inputs);
        bloom
    }
}

impl<'a, 'b> Extend<&'a BloomInput<'b>> for Bloom {
    #[inline]
    fn extend<T: IntoIterator<Item = &'a BloomInput<'b>>>(&mut self, inputs: T) {
        for input in inputs {
            self.accrue(*input);
        }
    }
}

impl Bloom {
    /// Returns a reference to the underlying data.
    #[inline]
    pub const fn data(&self) -> &[u8; BLOOM_SIZE_BYTES] {
        &self.0 .0
    }

    /// Returns a mutable reference to the underlying data.
    #[inline]
    pub fn data_mut(&mut self) -> &mut [u8; BLOOM_SIZE_BYTES] {
        &mut self.0 .0
    }

    /// Returns true if this bloom filter is a possible superset of the other
    /// bloom filter, admitting false positives.
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    #[inline]
    pub fn contains_input(&self, input: BloomInput<'_>) -> bool {
        self.contains(&input.into())
    }

    /// Compile-time version of [`contains`](Self::contains).
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    pub const fn const_contains(self, other: Self) -> bool {
        self.0.const_covers(other.0)
    }

    /// Returns true if this bloom filter is a possible superset of the other
    /// bloom filter, admitting false positives.
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    pub fn contains(&self, other: &Self) -> bool {
        self.0.covers(&other.0)
    }

    /// Accrues the input into the bloom filter.
    pub fn accrue(&mut self, input: BloomInput<'_>) {
        let hash = input.into_hash();

        let mut ptr = 0;

        for _ in 0..3 {
            let mut index = 0_usize;
            for _ in 0..ITEM_BYTES {
                index = (index << 8) | hash[ptr] as usize;
                ptr += 1;
            }
            index &= MASK;
            self.0[BLOOM_SIZE_BYTES - 1 - index / 8] |= 1 << (index % 8);
        }
    }

    /// Accrues the input into the bloom filter.
    pub fn accrue_bloom(&mut self, bloom: &Self) {
        *self |= *bloom;
    }

    /// Specialised Bloom filter that sets three bits out of 2048, given an
    /// arbitrary byte sequence.
    ///
    /// See Section 4.3.1 "Transaction Receipt" of the
    /// [Ethereum Yellow Paper][ref] (page 6).
    ///
    /// [ref]: https://ethereum.github.io/yellowpaper/paper.pdf
    pub fn m3_2048(&mut self, bytes: &[u8]) {
        self.m3_2048_hashed(&keccak256(bytes));
    }

    /// [`m3_2048`](Self::m3_2048) but with a pre-hashed input.
    pub fn m3_2048_hashed(&mut self, hash: &B256) {
        for i in [0, 2, 4] {
            let bit = (hash[i + 1] as usize + ((hash[i] as usize) << 8)) & 0x7FF;
            self[BLOOM_SIZE_BYTES - 1 - bit / 8] |= 1 << (bit % 8);
        }
    }

    /// Ingests a raw log into the bloom filter.
    pub fn accrue_raw_log(&mut self, address: Address, topics: &[B256]) {
        self.m3_2048(address.as_slice());
        for topic in topics.iter() {
            self.m3_2048(topic.as_slice());
        }
    }

    /// Ingests a log into the bloom filter.
    pub fn accrue_log(&mut self, log: &Log) {
        self.accrue_raw_log(log.address, log.topics())
    }

    /// True if the bloom filter contains a log with given address and topics.
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    pub fn contains_raw_log(&self, address: Address, topics: &[B256]) -> bool {
        let mut bloom = Self::default();
        bloom.accrue_raw_log(address, topics);
        self.contains(&bloom)
    }

    /// True if the bloom filter contains a log with given address and topics.
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    pub fn contains_log(&self, log: &Log) -> bool {
        self.contains_raw_log(log.address, log.topics())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hex;

    #[test]
    fn works() {
        let bloom = bloom!(
            "00000000000000000000000000000000
             00000000100000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000002020000000000000000000000
             00000000000000000000000800000000
             10000000000000000000000000000000
             00000000000000000000001000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000
             00000000000000000000000000000000"
        );
        let address = hex!("ef2d6d194084c2de36e0dabfce45d046b37d1106");
        let topic = hex!("02c69be41d0b7e40352fc85be1cd65eb03d40ef8427a0ca4596b1ead9a00e9fc");

        let mut my_bloom = Bloom::default();
        assert!(!my_bloom.contains_input(BloomInput::Raw(&address)));
        assert!(!my_bloom.contains_input(BloomInput::Raw(&topic)));

        my_bloom.accrue(BloomInput::Raw(&address));
        assert!(my_bloom.contains_input(BloomInput::Raw(&address)));
        assert!(!my_bloom.contains_input(BloomInput::Raw(&topic)));

        my_bloom.accrue(BloomInput::Raw(&topic));
        assert!(my_bloom.contains_input(BloomInput::Raw(&address)));
        assert!(my_bloom.contains_input(BloomInput::Raw(&topic)));

        assert_eq!(my_bloom, bloom);
    }
}
```
```rs [./src/bits/function.rs]
use crate::{Address, FixedBytes, Selector};
use core::borrow::Borrow;

wrap_fixed_bytes! {
    /// An Ethereum ABI function pointer, 24 bytes in length.
    ///
    /// An address (20 bytes), followed by a function selector (4 bytes).
    /// Encoded identical to `bytes24`.
    pub struct Function<24>;
}

impl<A, S> From<(A, S)> for Function
where
    A: Borrow<[u8; 20]>,
    S: Borrow<[u8; 4]>,
{
    #[inline]
    fn from((address, selector): (A, S)) -> Self {
        Self::from_address_and_selector(address, selector)
    }
}

impl Function {
    /// Creates an Ethereum function from an EVM word's lower 24 bytes
    /// (`word[..24]`).
    ///
    /// Note that this is different from `Address::from_word`, which uses the
    /// upper 20 bytes.
    #[inline]
    #[must_use]
    pub fn from_word(word: FixedBytes<32>) -> Self {
        Self(FixedBytes(word[..24].try_into().unwrap()))
    }

    /// Right-pads the function to 32 bytes (EVM word size).
    ///
    /// Note that this is different from `Address::into_word`, which left-pads
    /// the address.
    #[inline]
    #[must_use]
    pub fn into_word(&self) -> FixedBytes<32> {
        let mut word = [0; 32];
        word[..24].copy_from_slice(self.as_slice());
        FixedBytes(word)
    }

    /// Creates an Ethereum function from an address and selector.
    #[inline]
    pub fn from_address_and_selector<A, S>(address: A, selector: S) -> Self
    where
        A: Borrow<[u8; 20]>,
        S: Borrow<[u8; 4]>,
    {
        let mut bytes = [0; 24];
        bytes[..20].copy_from_slice(address.borrow());
        bytes[20..].copy_from_slice(selector.borrow());
        Self(FixedBytes(bytes))
    }

    /// Returns references to the address and selector of the function.
    #[inline]
    pub fn as_address_and_selector(&self) -> (&Address, &Selector) {
        // SAFETY: Function (24) = Address (20) + Selector (4)
        unsafe { (&*self.as_ptr().cast(), &*self.as_ptr().add(20).cast()) }
    }

    /// Returns the address and selector of the function.
    #[inline]
    pub fn to_address_and_selector(&self) -> (Address, Selector) {
        let (a, s) = self.as_address_and_selector();
        (*a, *s)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hex;

    #[test]
    fn function_parts() {
        let f = Function::new(hex!(
            "
            ffffffffffffffffffffffffffffffffffffffff
            12345678
        "
        ));

        let (a1, s1) = f.as_address_and_selector();
        assert_eq!(a1, hex!("ffffffffffffffffffffffffffffffffffffffff"));
        assert_eq!(s1, &hex!("12345678"));

        let (a2, s2) = f.to_address_and_selector();
        assert_eq!(a2, *a1);
        assert_eq!(s2, *s1);
    }
}
```
```rs [./src/bits/macros.rs]
/// Wrap a fixed-size byte array in a newtype, delegating all methods to the
/// underlying [`crate::FixedBytes`].
///
/// This functionally creates a new named `FixedBytes` that cannot be
/// type-confused for another named `FixedBytes`.
///
/// **NOTE:** This macro currently requires:
/// - `#![cfg_attr(docsrs, feature(doc_cfg, doc_auto_cfg))]` at the top level of the crate.
/// - The `derive_more` crate in scope.
///
/// # Examples
///
/// ```
/// use alloy_primitives::wrap_fixed_bytes;
///
/// // These hashes are the same length, and have the same functionality, but
/// // are distinct types
/// wrap_fixed_bytes!(pub struct KeccakOutput<32>;);
/// wrap_fixed_bytes!(pub struct MerkleTreeItem<32>;);
/// ```
#[macro_export]
macro_rules! wrap_fixed_bytes {
    (
        $(#[$attrs:meta])*
        $vis:vis struct $name:ident<$n:literal>;
    ) => {
        $crate::wrap_fixed_bytes!(
            extra_derives: [$crate::private::derive_more::Display],
            $(#[$attrs])*
            $vis struct $name<$n>;
        );
    };

    (
        extra_derives: [$($extra_derives:path),* $(,)?],
        $(#[$attrs:meta])*
        $vis:vis struct $name:ident<$n:literal>;
    ) => {
        $(#[$attrs])*
        #[derive(
            Clone,
            Copy,
            Default,
            PartialEq,
            Eq,
            PartialOrd,
            Ord,
            Hash,
            $crate::private::derive_more::AsMut,
            $crate::private::derive_more::AsRef,
            $crate::private::derive_more::BitAnd,
            $crate::private::derive_more::BitAndAssign,
            $crate::private::derive_more::BitOr,
            $crate::private::derive_more::BitOrAssign,
            $crate::private::derive_more::BitXor,
            $crate::private::derive_more::BitXorAssign,
            $crate::private::derive_more::Not,
            $crate::private::derive_more::Deref,
            $crate::private::derive_more::DerefMut,
            $crate::private::derive_more::From,
            $crate::private::derive_more::FromStr,
            $crate::private::derive_more::Index,
            $crate::private::derive_more::IndexMut,
            $crate::private::derive_more::Into,
            $crate::private::derive_more::IntoIterator,
            $crate::private::derive_more::LowerHex,
            $crate::private::derive_more::UpperHex,
            $(
                $extra_derives,
            )*
        )]
        #[repr(transparent)]
        $vis struct $name(#[into_iterator(owned, ref, ref_mut)] pub $crate::FixedBytes<$n>);

        impl $crate::private::From<[u8; $n]> for $name {
            #[inline]
            fn from(value: [u8; $n]) -> Self {
                Self($crate::FixedBytes(value))
            }
        }

        impl $crate::private::From<$name> for [u8; $n] {
            #[inline]
            fn from(value: $name) -> Self {
                value.0 .0
            }
        }

        impl<'a> $crate::private::From<&'a [u8; $n]> for $name {
            #[inline]
            fn from(value: &'a [u8; $n]) -> Self {
                Self($crate::FixedBytes(*value))
            }
        }

        impl<'a> $crate::private::From<&'a mut [u8; $n]> for $name {
            #[inline]
            fn from(value: &'a mut [u8; $n]) -> Self {
                Self($crate::FixedBytes(*value))
            }
        }

        impl $crate::private::TryFrom<&[u8]> for $name {
            type Error = $crate::private::core::array::TryFromSliceError;

            #[inline]
            fn try_from(slice: &[u8]) -> Result<Self, Self::Error> {
                <&Self as $crate::private::TryFrom<&[u8]>>::try_from(slice).copied()
            }
        }

        impl $crate::private::TryFrom<&mut [u8]> for $name {
            type Error = $crate::private::core::array::TryFromSliceError;

            #[inline]
            fn try_from(slice: &mut [u8]) -> Result<Self, Self::Error> {
                <Self as $crate::private::TryFrom<&[u8]>>::try_from(&*slice)
            }
        }

        impl<'a> $crate::private::TryFrom<&'a [u8]> for &'a $name {
            type Error = $crate::private::core::array::TryFromSliceError;

            #[inline]
            #[allow(unsafe_code)]
            fn try_from(slice: &'a [u8]) -> Result<&'a $name, Self::Error> {
                // SAFETY: `$name` is `repr(transparent)` for `FixedBytes<$n>`
                // and consequently `[u8; $n]`
                <&[u8; $n] as $crate::private::TryFrom<&[u8]>>::try_from(slice)
                    .map(|array_ref| unsafe { $crate::private::core::mem::transmute(array_ref) })
            }
        }

        impl<'a> $crate::private::TryFrom<&'a mut [u8]> for &'a mut $name {
            type Error = $crate::private::core::array::TryFromSliceError;

            #[inline]
            #[allow(unsafe_code)]
            fn try_from(slice: &'a mut [u8]) -> Result<&'a mut $name, Self::Error> {
                // SAFETY: `$name` is `repr(transparent)` for `FixedBytes<$n>`
                // and consequently `[u8; $n]`
                <&mut [u8; $n] as $crate::private::TryFrom<&mut [u8]>>::try_from(slice)
                    .map(|array_ref| unsafe { $crate::private::core::mem::transmute(array_ref) })
            }
        }

        impl $crate::private::AsRef<[u8; $n]> for $name {
            #[inline]
            fn as_ref(&self) -> &[u8; $n] {
                &self.0 .0
            }
        }

        impl $crate::private::AsMut<[u8; $n]> for $name {
            #[inline]
            fn as_mut(&mut self) -> &mut [u8; $n] {
                &mut self.0 .0
            }
        }

        impl $crate::private::AsRef<[u8]> for $name {
            #[inline]
            fn as_ref(&self) -> &[u8] {
                &self.0 .0
            }
        }

        impl $crate::private::AsMut<[u8]> for $name {
            #[inline]
            fn as_mut(&mut self) -> &mut [u8] {
                &mut self.0 .0
            }
        }

        impl $crate::private::core::fmt::Debug for $name {
            fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
                $crate::private::core::fmt::Debug::fmt(&self.0, f)
            }
        }

        impl $crate::private::core::ops::BitAnd<&Self> for $name {
            type Output = Self;

            #[inline]
            fn bitand(self, rhs: &Self) -> Self {
                Self(self.0.bitand(&rhs.0))
            }
        }

        impl $crate::private::core::ops::BitAndAssign<&Self> for $name {
            #[inline]
            fn bitand_assign(&mut self, rhs: &Self) {
                self.0.bitand_assign(&rhs.0)
            }
        }

        impl $crate::private::core::ops::BitOr<&Self> for $name {
            type Output = Self;

            #[inline]
            fn bitor(self, rhs: &Self) -> Self {
                Self(self.0.bitor(&rhs.0))
            }
        }

        impl $crate::private::core::ops::BitOrAssign<&Self> for $name {
            #[inline]
            fn bitor_assign(&mut self, rhs: &Self) {
                self.0.bitor_assign(&rhs.0)
            }
        }

        impl $crate::private::core::ops::BitXor<&Self> for $name {
            type Output = Self;

            #[inline]
            fn bitxor(self, rhs: &Self) -> Self {
                Self(self.0.bitxor(&rhs.0))
            }
        }

        impl $crate::private::core::ops::BitXorAssign<&Self> for $name {
            #[inline]
            fn bitxor_assign(&mut self, rhs: &Self) {
                self.0.bitxor_assign(&rhs.0)
            }
        }

        $crate::impl_fb_traits!($name, $n);
        $crate::impl_rlp!($name, $n);
        $crate::impl_serde!($name);
        $crate::impl_allocative!($name);
        $crate::impl_arbitrary!($name, $n);
        $crate::impl_rand!($name);
        $crate::impl_diesel!($name, $n);

        impl $name {
            /// Array of Zero bytes.
            pub const ZERO: Self = Self($crate::FixedBytes::ZERO);

            /// Wraps the given byte array in this type.
            #[inline]
            pub const fn new(bytes: [u8; $n]) -> Self {
                Self($crate::FixedBytes(bytes))
            }

            /// Creates a new byte array with the last byte set to `x`.
            #[inline]
            pub const fn with_last_byte(x: u8) -> Self {
                Self($crate::FixedBytes::with_last_byte(x))
            }

            /// Creates a new byte array where all bytes are set to `byte`.
            #[inline]
            pub const fn repeat_byte(byte: u8) -> Self {
                Self($crate::FixedBytes::repeat_byte(byte))
            }

            /// Returns the size of this array in bytes.
            #[inline]
            pub const fn len_bytes() -> usize {
                $n
            }

            $crate::impl_getrandom!();
            $crate::impl_rand!();

            /// Create a new byte array from the given slice `src`.
            ///
            /// For a fallible version, use the `TryFrom<&[u8]>` implementation.
            ///
            /// # Note
            ///
            /// The given bytes are interpreted in big endian order.
            ///
            /// # Panics
            ///
            /// If the length of `src` and the number of bytes in `Self` do not match.
            #[inline]
            #[track_caller]
            pub fn from_slice(src: &[u8]) -> Self {
                match Self::try_from(src) {
                    Ok(x) => x,
                    Err(_) => panic!("cannot convert a slice of length {} to {}", src.len(), stringify!($name)),
                }
            }

            /// Create a new byte array from the given slice `src`, left-padding it
            /// with zeroes if necessary.
            ///
            /// # Note
            ///
            /// The given bytes are interpreted in big endian order.
            ///
            /// # Panics
            ///
            /// Panics if `src.len() > N`.
            #[inline]
            #[track_caller]
            pub fn left_padding_from(value: &[u8]) -> Self {
                Self($crate::FixedBytes::left_padding_from(value))
            }

            /// Create a new byte array from the given slice `src`, right-padding it
            /// with zeroes if necessary.
            ///
            /// # Note
            ///
            /// The given bytes are interpreted in big endian order.
            ///
            /// # Panics
            ///
            /// Panics if `src.len() > N`.
            #[inline]
            #[track_caller]
            pub fn right_padding_from(value: &[u8]) -> Self {
                Self($crate::FixedBytes::right_padding_from(value))
            }

            /// Returns the inner bytes array.
            #[inline]
            pub const fn into_array(self) -> [u8; $n] {
                self.0 .0
            }

            /// Returns `true` if all bits set in `b` are also set in `self`.
            #[inline]
            pub fn covers(&self, b: &Self) -> bool {
                &(*b & *self) == b
            }

            /// Compile-time equality. NOT constant-time equality.
            pub const fn const_eq(&self, other: &Self) -> bool {
                self.0.const_eq(&other.0)
            }

            /// Computes the bitwise AND of two `FixedBytes`.
            pub const fn bit_and(self, rhs: Self) -> Self {
                Self(self.0.bit_and(rhs.0))
            }

            /// Computes the bitwise OR of two `FixedBytes`.
            pub const fn bit_or(self, rhs: Self) -> Self {
                Self(self.0.bit_or(rhs.0))
            }

            /// Computes the bitwise XOR of two `FixedBytes`.
            pub const fn bit_xor(self, rhs: Self) -> Self {
                Self(self.0.bit_xor(rhs.0))
            }
        }
    };
}

// Extra traits that cannot be derived automatically
#[doc(hidden)]
#[macro_export]
macro_rules! impl_fb_traits {
    (impl<$($const:ident)?> Borrow<$t:ty> for $b:ty) => {
        impl<$($const N: usize)?> $crate::private::Borrow<$t> for $b {
            #[inline]
            fn borrow(&self) -> &$t {
                $crate::private::Borrow::borrow(&self.0)
            }
        }
    };

    (impl<$($const:ident)?> BorrowMut<$t:ty> for $b:ty) => {
        impl<$($const N: usize)?> $crate::private::BorrowMut<$t> for $b {
            #[inline]
            fn borrow_mut(&mut self) -> &mut $t {
                $crate::private::BorrowMut::borrow_mut(&mut self.0)
            }
        }
    };

    (unsafe impl<$lt:lifetime, $($const:ident)?> From<$a:ty> for $b:ty) => {
        impl<$lt, $($const N: usize)?> $crate::private::From<$a> for $b {
            #[inline]
            #[allow(unsafe_code)]
            fn from(value: $a) -> $b {
                // SAFETY: guaranteed by caller
                unsafe { $crate::private::core::mem::transmute::<$a, $b>(value) }
            }
        }
    };

    (impl<$($const:ident)?> cmp::$tr:ident<$a:ty> for $b:ty where fn $fn:ident -> $ret:ty $(, [$e:expr])?) => {
        impl<$($const N: usize)?> $crate::private::$tr<$a> for $b {
            #[inline]
            fn $fn(&self, other: &$a) -> $ret {
                $crate::private::$tr::$fn(&self.0 $([$e])?, other)
            }
        }

        impl<$($const N: usize)?> $crate::private::$tr<$b> for $a {
            #[inline]
            fn $fn(&self, other: &$b) -> $ret {
                $crate::private::$tr::$fn(self, &other.0 $([$e])?)
            }
        }

        impl<$($const N: usize)?> $crate::private::$tr<&$a> for $b {
            #[inline]
            fn $fn(&self, other: &&$a) -> $ret {
                $crate::private::$tr::$fn(&self.0 $([$e])?, *other)
            }
        }

        impl<$($const N: usize)?> $crate::private::$tr<$b> for &$a {
            #[inline]
            fn $fn(&self, other: &$b) -> $ret {
                $crate::private::$tr::$fn(*self, &other.0 $([$e])?)
            }
        }

        impl<$($const N: usize)?> $crate::private::$tr<$a> for &$b {
            #[inline]
            fn $fn(&self, other: &$a) -> $ret {
                $crate::private::$tr::$fn(&self.0 $([$e])?, other)
            }
        }

        impl<$($const N: usize)?> $crate::private::$tr<&$b> for $a {
            #[inline]
            fn $fn(&self, other: &&$b) -> $ret {
                $crate::private::$tr::$fn(self, &other.0 $([$e])?)
            }
        }
    };

    ($t:ty, $n:tt $(, $const:ident)?) => {
        // Borrow is not automatically implemented for references
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8]>        for $t);
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8]>        for &$t);
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8]>        for &mut $t);
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8; $n]>    for $t);
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8; $n]>    for &$t);
        $crate::impl_fb_traits!(impl<$($const)?> Borrow<[u8; $n]>    for &mut $t);

        $crate::impl_fb_traits!(impl<$($const)?> BorrowMut<[u8]>     for $t);
        $crate::impl_fb_traits!(impl<$($const)?> BorrowMut<[u8]>     for &mut $t);
        $crate::impl_fb_traits!(impl<$($const)?> BorrowMut<[u8; $n]> for $t);
        $crate::impl_fb_traits!(impl<$($const)?> BorrowMut<[u8; $n]> for &mut $t);

        // Implement conversion traits for references with `mem::transmute`
        // SAFETY: `repr(transparent)`
        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a [u8; $n]>     for &'a $t);
        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a mut [u8; $n]> for &'a $t);
        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a mut [u8; $n]> for &'a mut $t);

        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a $t>           for &'a [u8; $n]);
        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a mut $t>       for &'a [u8; $n]);
        $crate::impl_fb_traits!(unsafe impl<'a, $($const)?> From<&'a mut $t>       for &'a mut [u8; $n]);

        // Implement PartialEq, PartialOrd, with slice and array
        $crate::impl_fb_traits!(impl<$($const)?> cmp::PartialEq<[u8]> for $t where fn eq -> bool);
        $crate::impl_fb_traits!(impl<$($const)?> cmp::PartialEq<[u8; $n]> for $t where fn eq -> bool);
        $crate::impl_fb_traits!(
            impl<$($const)?> cmp::PartialOrd<[u8]> for $t
            where
                fn partial_cmp -> $crate::private::Option<$crate::private::Ordering>,
                [..] // slices $t
        );

        impl<$($const N: usize)?> $crate::hex::FromHex for $t {
            type Error = $crate::hex::FromHexError;

            #[inline]
            fn from_hex<T: $crate::private::AsRef<[u8]>>(hex: T) -> Result<Self, Self::Error> {
                $crate::hex::decode_to_array(hex).map(Self::new)
            }
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "getrandom")]
macro_rules! impl_getrandom {
    () => {
        /// Creates a new fixed byte array with the default cryptographic random number
        /// generator.
        ///
        /// This is `rand::thread_rng` if the "rand" and "std" features are enabled, otherwise
        /// it uses `getrandom::getrandom`. Both are cryptographically secure.
        #[inline]
        #[track_caller]
        #[cfg_attr(docsrs, doc(cfg(feature = "getrandom")))]
        pub fn random() -> Self {
            Self($crate::FixedBytes::random())
        }

        /// Tries to create a new fixed byte array with the default cryptographic random number
        /// generator.
        ///
        /// See [`random`](Self::random) for more details.
        #[inline]
        #[cfg_attr(docsrs, doc(cfg(feature = "getrandom")))]
        pub fn try_random() -> $crate::private::Result<Self, $crate::private::getrandom::Error> {
            $crate::FixedBytes::try_random().map(Self)
        }

        /// Fills this fixed byte array with the default cryptographic random number generator.
        ///
        /// See [`random`](Self::random) for more details.
        #[inline]
        #[track_caller]
        #[cfg_attr(docsrs, doc(cfg(feature = "getrandom")))]
        pub fn randomize(&mut self) {
            self.0.randomize();
        }

        /// Tries to fill this fixed byte array with the default cryptographic random number
        /// generator.
        ///
        /// See [`random`](Self::random) for more details.
        #[inline]
        #[cfg_attr(docsrs, doc(cfg(feature = "getrandom")))]
        pub fn try_randomize(
            &mut self,
        ) -> $crate::private::Result<(), $crate::private::getrandom::Error> {
            self.0.try_randomize()
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "getrandom"))]
macro_rules! impl_getrandom {
    () => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "rand")]
macro_rules! impl_rand {
    () => {
        /// Creates a new fixed byte array with the given random number generator.
        #[inline]
        #[doc(alias = "random_using")]
        #[cfg_attr(docsrs, doc(cfg(feature = "rand")))]
        pub fn random_with<R: $crate::private::rand::RngCore + ?Sized>(rng: &mut R) -> Self {
            Self($crate::FixedBytes::random_with(rng))
        }

        /// Tries to create a new fixed byte array with the given random number generator.
        #[inline]
        #[cfg_attr(docsrs, doc(cfg(feature = "rand")))]
        pub fn try_random_with<R: $crate::private::rand::TryRngCore + ?Sized>(
            rng: &mut R,
        ) -> $crate::private::Result<Self, R::Error> {
            $crate::FixedBytes::try_random_with(rng).map(Self)
        }

        /// Fills this fixed byte array with the given random number generator.
        #[inline]
        #[doc(alias = "randomize_using")]
        #[cfg_attr(docsrs, doc(cfg(feature = "rand")))]
        pub fn randomize_with<R: $crate::private::rand::RngCore + ?Sized>(&mut self, rng: &mut R) {
            self.0.randomize_with(rng);
        }

        /// Tries to fill this fixed byte array with the given random number generator.
        #[inline]
        #[cfg_attr(docsrs, doc(cfg(feature = "rand")))]
        pub fn try_randomize_with<R: $crate::private::rand::TryRngCore + ?Sized>(
            &mut self,
            rng: &mut R,
        ) -> $crate::private::Result<(), R::Error> {
            self.0.try_randomize_with(rng)
        }
    };

    ($t:ty) => {
        #[cfg_attr(docsrs, doc(cfg(feature = "rand")))]
        impl $crate::private::rand::distr::Distribution<$t>
            for $crate::private::rand::distr::StandardUniform
        {
            #[inline]
            fn sample<R: $crate::private::rand::Rng + ?Sized>(&self, rng: &mut R) -> $t {
                <$t>::random_with(rng)
            }
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "rand"))]
macro_rules! impl_rand {
    ($($t:tt)*) => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "rlp")]
macro_rules! impl_rlp {
    ($t:ty, $n:literal) => {
        #[cfg_attr(docsrs, doc(cfg(feature = "rlp")))]
        impl $crate::private::alloy_rlp::Decodable for $t {
            #[inline]
            fn decode(buf: &mut &[u8]) -> $crate::private::alloy_rlp::Result<Self> {
                $crate::private::alloy_rlp::Decodable::decode(buf).map(Self)
            }
        }

        #[cfg_attr(docsrs, doc(cfg(feature = "rlp")))]
        impl $crate::private::alloy_rlp::Encodable for $t {
            #[inline]
            fn length(&self) -> usize {
                $crate::private::alloy_rlp::Encodable::length(&self.0)
            }

            #[inline]
            fn encode(&self, out: &mut dyn $crate::private::alloy_rlp::BufMut) {
                $crate::private::alloy_rlp::Encodable::encode(&self.0, out)
            }
        }

        $crate::private::alloy_rlp::impl_max_encoded_len!($t, {
            $n + $crate::private::alloy_rlp::length_of_length($n)
        });
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "rlp"))]
macro_rules! impl_rlp {
    ($t:ty, $n:literal) => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "allocative")]
macro_rules! impl_allocative {
    ($t:ty) => {
        #[cfg_attr(docsrs, doc(cfg(feature = "allocative")))]
        impl $crate::private::allocative::Allocative for $t {
            #[inline]
            fn visit<'a, 'b: 'a>(&self, visitor: &'a mut $crate::private::allocative::Visitor<'b>) {
                $crate::private::allocative::Allocative::visit(&self.0, visitor)
            }
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "allocative"))]
macro_rules! impl_allocative {
    ($t:ty) => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "serde")]
macro_rules! impl_serde {
    ($t:ty) => {
        #[cfg_attr(docsrs, doc(cfg(feature = "serde")))]
        impl $crate::private::serde::Serialize for $t {
            #[inline]
            fn serialize<S: $crate::private::serde::Serializer>(
                &self,
                serializer: S,
            ) -> Result<S::Ok, S::Error> {
                $crate::private::serde::Serialize::serialize(&self.0, serializer)
            }
        }

        #[cfg_attr(docsrs, doc(cfg(feature = "serde")))]
        impl<'de> $crate::private::serde::Deserialize<'de> for $t {
            #[inline]
            fn deserialize<D: $crate::private::serde::Deserializer<'de>>(
                deserializer: D,
            ) -> Result<Self, D::Error> {
                $crate::private::serde::Deserialize::deserialize(deserializer).map(Self)
            }
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "serde"))]
macro_rules! impl_serde {
    ($t:ty) => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "arbitrary")]
macro_rules! impl_arbitrary {
    ($t:ty, $n:literal) => {
        #[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
        impl<'a> $crate::private::arbitrary::Arbitrary<'a> for $t {
            #[inline]
            fn arbitrary(u: &mut $crate::private::arbitrary::Unstructured<'a>) -> $crate::private::arbitrary::Result<Self> {
                <$crate::FixedBytes<$n> as $crate::private::arbitrary::Arbitrary>::arbitrary(u).map(Self)
            }

            #[inline]
            fn arbitrary_take_rest(u: $crate::private::arbitrary::Unstructured<'a>) -> $crate::private::arbitrary::Result<Self> {
                <$crate::FixedBytes<$n> as $crate::private::arbitrary::Arbitrary>::arbitrary_take_rest(u).map(Self)
            }

            #[inline]
            fn size_hint(depth: usize) -> (usize, Option<usize>) {
                <$crate::FixedBytes<$n> as $crate::private::arbitrary::Arbitrary>::size_hint(depth)
            }
        }

        #[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
        impl $crate::private::proptest::arbitrary::Arbitrary for $t {
            type Parameters = <$crate::FixedBytes<$n> as $crate::private::proptest::arbitrary::Arbitrary>::Parameters;
            type Strategy = $crate::private::proptest::strategy::Map<
                <$crate::FixedBytes<$n> as $crate::private::proptest::arbitrary::Arbitrary>::Strategy,
                fn($crate::FixedBytes<$n>) -> Self,
            >;

            #[inline]
            fn arbitrary() -> Self::Strategy {
                use $crate::private::proptest::strategy::Strategy;
                <$crate::FixedBytes<$n> as $crate::private::proptest::arbitrary::Arbitrary>::arbitrary()
                    .prop_map(Self)
            }

            #[inline]
            fn arbitrary_with(args: Self::Parameters) -> Self::Strategy {
                use $crate::private::proptest::strategy::Strategy;
                <$crate::FixedBytes<$n> as $crate::private::proptest::arbitrary::Arbitrary>::arbitrary_with(args)
                    .prop_map(Self)
            }
        }
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "arbitrary"))]
macro_rules! impl_arbitrary {
    ($t:ty, $n:literal) => {};
}

#[doc(hidden)]
#[macro_export]
#[cfg(feature = "diesel")]
macro_rules! impl_diesel {
    ($t:ty, $n:literal) => {
        const _: () = {
            use $crate::private::diesel::{
                backend::Backend,
                deserialize::{FromSql, Result as DeserResult},
                expression::AsExpression,
                internal::derives::as_expression::Bound,
                query_builder::bind_collector::RawBytesBindCollector,
                serialize::{Output, Result as SerResult, ToSql},
                sql_types::{Binary, Nullable, SingleValue},
                Queryable,
            };

            impl<Db> ToSql<Binary, Db> for $t
            where
                for<'c> Db: Backend<BindCollector<'c> = RawBytesBindCollector<Db>>,
            {
                fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Db>) -> SerResult {
                    <$crate::FixedBytes<$n> as ToSql<Binary, Db>>::to_sql(&self.0, out)
                }
            }

            impl<Db> FromSql<Binary, Db> for $t
            where
                Db: Backend,
                *const [u8]: FromSql<Binary, Db>,
            {
                fn from_sql(bytes: Db::RawValue<'_>) -> DeserResult<Self> {
                    <$crate::FixedBytes<$n> as FromSql<Binary, Db>>::from_sql(bytes).map(Self)
                }
            }

            // Note: the following impls are equivalent to the expanded derive macro produced by
            // #[derive(diesel::AsExpression)]
            impl<Db> ToSql<Nullable<Binary>, Db> for $t
            where
                for<'c> Db: Backend<BindCollector<'c> = RawBytesBindCollector<Db>>,
            {
                fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Db>) -> SerResult {
                    <$crate::FixedBytes<$n> as ToSql<Nullable<Binary>, Db>>::to_sql(&self.0, out)
                }
            }

            impl AsExpression<Binary> for $t {
                type Expression = Bound<Binary, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            impl AsExpression<Nullable<Binary>> for $t {
                type Expression = Bound<Nullable<Binary>, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            impl AsExpression<Binary> for &$t {
                type Expression = Bound<Binary, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            impl AsExpression<Nullable<Binary>> for &$t {
                type Expression = Bound<Nullable<Binary>, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            impl AsExpression<Binary> for &&$t {
                type Expression = Bound<Binary, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            impl AsExpression<Nullable<Binary>> for &&$t {
                type Expression = Bound<Nullable<Binary>, Self>;
                fn as_expression(self) -> Self::Expression {
                    Bound::new(self)
                }
            }

            // Note: the following impl is equivalent to the expanded derive macro produced by
            // #[derive(diesel::Queryable)]
            impl<Db, St> Queryable<St, Db> for $t
            where
                Db: Backend,
                St: SingleValue,
                Self: FromSql<St, Db>,
            {
                type Row = Self;
                fn build(row: Self::Row) -> DeserResult<Self> {
                    Ok(row)
                }
            }
        };
    };
}

#[doc(hidden)]
#[macro_export]
#[cfg(not(feature = "diesel"))]
macro_rules! impl_diesel {
    ($t:ty, $n:literal) => {};
}

macro_rules! fixed_bytes_macros {
    ($d:tt $($(#[$attr:meta])* macro $name:ident($ty:ident $($rest:tt)*);)*) => {$(
        /// Converts a sequence of string literals containing hex-encoded data
        #[doc = concat!(
            "into a new [`", stringify!($ty), "`][crate::", stringify!($ty), "] at compile time.\n",
        )]
        ///
        /// If the input is empty, a zero-initialized array is returned.
        ///
        /// See [`hex!`](crate::hex!) for more information.
        ///
        /// # Examples
        ///
        /// ```
        #[doc = concat!("use alloy_primitives::{", stringify!($name), ", ", stringify!($ty), "};")]
        ///
        #[doc = concat!("const ZERO: ", stringify!($ty $($rest)*), " = ", stringify!($name), "!();")]
        #[doc = concat!("assert_eq!(ZERO, ", stringify!($ty), "::ZERO);")]
        ///
        /// # stringify!(
        #[doc = concat!("let byte_array: ", stringify!($ty), " = ", stringify!($name), "!(\"0x0123abcd…\");")]
        /// # );
        /// ```
        $(#[$attr])*
        #[macro_export]
        macro_rules! $name {
            () => {
                $crate::$ty::ZERO
            };

            ($d ($d t:tt)+) => {
                $crate::$ty::new($crate::hex!($d ($d t)+))
            };
        }
    )*};
}

fixed_bytes_macros! { $
    macro address(Address);

    macro b64(B64);

    macro b128(B128);

    macro b256(B256);

    macro b512(B512);

    macro bloom(Bloom);

    macro fixed_bytes(FixedBytes<0>); // <0> is just for the doctest
}

/// Converts a sequence of string literals containing hex-encoded data into a
/// new [`Bytes`][crate::Bytes] at compile time.
///
/// If the input is empty, an empty instance is returned.
///
/// See [`hex!`](crate::hex!) for more information.
///
/// # Examples
///
/// ```
/// use alloy_primitives::{bytes, Bytes};
///
/// static MY_BYTES: Bytes = bytes!("0x0123" "0xabcd");
/// assert_eq!(MY_BYTES, Bytes::from(&[0x01, 0x23, 0xab, 0xcd]));
/// ```
#[macro_export]
macro_rules! bytes {
    () => {
        $crate::Bytes::new()
    };

    ($($s:literal)+) => {const {
        $crate::Bytes::from_static(&$crate::hex!($($s)+))
    }};

    [$($inner:expr),+ $(,)?] => {const {
        $crate::Bytes::from_static(&[$($inner),+])
    }};

    [$inner:expr; $size:literal] => {const {
        $crate::Bytes::from_static(&[$inner; $size])
    }};
}

#[cfg(test)]
mod tests {
    use crate::{hex, Address, Bytes, FixedBytes};

    #[test]
    fn bytes_macros() {
        static B1: Bytes = bytes!("010203040506070809");
        static B2: Bytes = bytes![1, 2, 3, 4, 5, 6, 7, 8, 9];
        static B3: Bytes = bytes![1, 2, 3, 4, 5, 6, 7, 8, 9,];

        assert_eq!(B1, B2);
        assert_eq!(B1, B3);

        static B4: Bytes = bytes!("0000");
        static B5: Bytes = bytes![0; 2];
        static B6: Bytes = bytes![0, 0];
        assert_eq!(B4, B5);
        assert_eq!(B4, B6);
    }

    #[test]
    fn fixed_byte_macros() {
        const A0: Address = address!();
        assert_eq!(A0, Address::ZERO);

        const A1: Address = address!("0x0102030405060708090a0b0c0d0e0f1011121314");
        const A2: Address = Address(fixed_bytes!("0x0102030405060708090a0b0c0d0e0f1011121314"));
        const A3: Address = Address(FixedBytes(hex!("0x0102030405060708090a0b0c0d0e0f1011121314")));
        assert_eq!(A1, A2);
        assert_eq!(A1, A3);
        assert_eq!(A1, hex!("0x0102030405060708090a0b0c0d0e0f1011121314"));

        static B: Bytes = bytes!("0x112233");
        assert_eq!(B[..], [0x11, 0x22, 0x33]);

        static EMPTY_BYTES1: Bytes = bytes!();
        static EMPTY_BYTES2: Bytes = bytes!("");
        assert!(EMPTY_BYTES1.is_empty());
        assert_eq!(EMPTY_BYTES1, Bytes::new());
        assert_eq!(EMPTY_BYTES1, EMPTY_BYTES2);
    }
}
```
```rs [./src/log/serde.rs]
//! This is an implementation of serde for Log for
//! both human-readable and binary forms.
//!
//! Ethereum JSON RPC requires logs in a flattened form.
//! However `serde(flatten)` breaks binary implementations.
//!
//! This module uses a trick to select a proxy for serde:
//! 1. LogFlattenSerializer for a human-readable (JSON) serializer,
//! 2. LogFlattenDeserializer for a human-readable (JSON) deserializer,
//! 3. LogUnflattenSerializer for a binary serializer,
//! 4. LogUnflattenDeserializer for a binary deserializer.

use crate::{Address, Log};
use serde::{Deserialize, Deserializer, Serialize, Serializer};

#[derive(Serialize)]
#[serde(rename = "Log")]
struct LogFlattenSerializer<'a, T> {
    address: &'a Address,
    #[serde(flatten)]
    data: &'a T,
}

#[derive(Deserialize)]
#[serde(rename = "Log")]
struct LogFlattenDeserializer<T> {
    address: Address,
    #[serde(flatten)]
    data: T,
}

#[derive(Serialize)]
#[serde(rename = "Log")]
struct LogUnflattenSerializer<'a, T> {
    address: &'a Address,
    data: &'a T,
}

#[derive(Deserialize)]
#[serde(rename = "Log")]
struct LogUnflattenDeserializer<T> {
    address: Address,
    data: T,
}

impl<T: Serialize> Serialize for Log<T> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let Self { address, data } = self;
        if serializer.is_human_readable() {
            let replace = LogFlattenSerializer { address, data };
            replace.serialize(serializer)
        } else {
            let replace = LogUnflattenSerializer { address, data };
            replace.serialize(serializer)
        }
    }
}

impl<'de, T: Deserialize<'de>> Deserialize<'de> for Log<T> {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        if deserializer.is_human_readable() {
            let LogFlattenDeserializer { address, data } = <_>::deserialize(deserializer)?;
            Ok(Self { address, data })
        } else {
            let LogUnflattenDeserializer { address, data } = <_>::deserialize(deserializer)?;
            Ok(Self { address, data })
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        log::{Log, LogData},
        Bytes,
    };
    use alloc::vec::Vec;

    #[derive(Debug, PartialEq, serde::Serialize, serde::Deserialize)]
    struct TestStruct {
        logs: Vec<Log>,
    }

    fn gen_test_struct() -> TestStruct {
        // assume it's random:
        TestStruct {
            logs: vec![Log {
                address: address!("0x3100000000000000000000000000000000000001"),
                data: LogData::new(
                    vec![b256!("0x32eff959e2e8d1609edc4b39ccf75900aa6c1da5719f8432752963fdf008234f")],
                    Bytes::from_static(b"00000000000000000000000000000000000000000000000000000000000000021e9dbc1a11f8e046a72d1296cc2d8bb0d1544d56fd0b9bb8890a0f89b88036541e9dbc1a11f8e046a72d1296cc2d8bb0d1544d56fd0b9bb8890a0f89b8803654"),
                ).unwrap(),
            }],
        }
    }

    #[test]
    fn test_log_bincode_roundtrip() {
        let generated = gen_test_struct();

        let bytes = bincode::serialize(&generated).unwrap();
        let parsed: TestStruct = bincode::deserialize(&bytes).unwrap();
        assert_eq!(generated, parsed);
    }

    #[test]
    fn test_log_bcs_roundtrip() {
        let generated = gen_test_struct();

        let bytes = bcs::to_bytes(&generated).unwrap();
        let parsed: TestStruct = bcs::from_bytes(&bytes).unwrap();
        assert_eq!(generated, parsed);
    }

    #[test]
    fn test_log_json_roundtrip() {
        let expected = "{\"logs\":[{\"address\":\"0x3100000000000000000000000000000000000001\",\"topics\":[\"0x32eff959e2e8d1609edc4b39ccf75900aa6c1da5719f8432752963fdf008234f\"],\"data\":\"0x303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030323165396462633161313166386530343661373264313239366363326438626230643135343464353666643062396262383839306130663839623838303336353431653964626331613131663865303436613732643132393663633264386262306431353434643536666430623962623838393061306638396238383033363534\"}]}";

        let parsed: TestStruct = serde_json::from_str(expected).unwrap();
        let dumped = serde_json::to_string(&parsed).unwrap();

        assert_eq!(expected, dumped);
    }
}
```
```rs [./src/log/mod.rs]
use crate::{Address, Bloom, Bytes, B256};
use alloc::vec::Vec;

#[cfg(feature = "serde")]
mod serde;

/// Compute the logs bloom filter for the given logs.
pub fn logs_bloom<'a>(logs: impl IntoIterator<Item = &'a Log>) -> Bloom {
    let mut bloom = Bloom::ZERO;
    for log in logs {
        bloom.accrue_log(log);
    }
    bloom
}

/// An Ethereum event log object.
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
#[cfg_attr(feature = "arbitrary", derive(derive_arbitrary::Arbitrary, proptest_derive::Arbitrary))]
pub struct LogData {
    /// The indexed topic list.
    topics: Vec<B256>,
    /// The plain data.
    pub data: Bytes,
}

impl LogData {
    /// Creates a new log, without length-checking. This allows creation of
    /// invalid logs. May be safely used when the length of the topic list is
    /// known to be 4 or less.
    #[inline]
    pub const fn new_unchecked(topics: Vec<B256>, data: Bytes) -> Self {
        Self { topics, data }
    }

    /// Creates a new log.
    #[inline]
    pub fn new(topics: Vec<B256>, data: Bytes) -> Option<Self> {
        let this = Self::new_unchecked(topics, data);
        this.is_valid().then_some(this)
    }

    /// Creates a new empty log.
    #[inline]
    pub const fn empty() -> Self {
        Self { topics: Vec::new(), data: Bytes::new() }
    }

    /// True if valid, false otherwise.
    #[inline]
    pub fn is_valid(&self) -> bool {
        self.topics.len() <= 4
    }

    /// Get the topic list.
    #[inline]
    pub fn topics(&self) -> &[B256] {
        &self.topics
    }

    /// Get the topic list, mutably. This gives access to the internal
    /// array, without allowing extension of that array.
    #[inline]
    pub fn topics_mut(&mut self) -> &mut [B256] {
        &mut self.topics
    }

    /// Get a mutable reference to the topic list. This allows creation of
    /// invalid logs.
    #[inline]
    pub fn topics_mut_unchecked(&mut self) -> &mut Vec<B256> {
        &mut self.topics
    }

    /// Set the topic list, without length-checking. This allows creation of
    /// invalid logs.
    #[inline]
    pub fn set_topics_unchecked(&mut self, topics: Vec<B256>) {
        self.topics = topics;
    }

    /// Set the topic list, truncating to 4 topics.
    #[inline]
    pub fn set_topics_truncating(&mut self, mut topics: Vec<B256>) {
        topics.truncate(4);
        self.set_topics_unchecked(topics);
    }

    /// Consumes the log data, returning the topic list and the data.
    #[inline]
    pub fn split(self) -> (Vec<B256>, Bytes) {
        (self.topics, self.data)
    }
}

/// Trait for an object that can be converted into a log data object.
pub trait IntoLogData {
    /// Convert into a [`LogData`] object.
    fn to_log_data(&self) -> LogData;
    /// Consume and convert into a [`LogData`] object.
    fn into_log_data(self) -> LogData;
}

impl IntoLogData for LogData {
    #[inline]
    fn to_log_data(&self) -> LogData {
        self.clone()
    }

    #[inline]
    fn into_log_data(self) -> LogData {
        self
    }
}

/// A log consists of an address, and some log data.
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "arbitrary", derive(derive_arbitrary::Arbitrary, proptest_derive::Arbitrary))]
pub struct Log<T = LogData> {
    /// The address which emitted this log.
    pub address: Address,
    /// The log data.
    pub data: T,
}

impl<T> core::ops::Deref for Log<T> {
    type Target = T;

    #[inline]
    fn deref(&self) -> &Self::Target {
        &self.data
    }
}

impl<T> core::ops::DerefMut for Log<T> {
    #[inline]
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.data
    }
}

impl<T> AsRef<Self> for Log<T> {
    fn as_ref(&self) -> &Self {
        self
    }
}

impl Log {
    /// Creates a new log.
    #[inline]
    pub fn new(address: Address, topics: Vec<B256>, data: Bytes) -> Option<Self> {
        LogData::new(topics, data).map(|data| Self { address, data })
    }

    /// Creates a new log.
    #[inline]
    pub const fn new_unchecked(address: Address, topics: Vec<B256>, data: Bytes) -> Self {
        Self { address, data: LogData::new_unchecked(topics, data) }
    }

    /// Creates a new empty log.
    #[inline]
    pub const fn empty() -> Self {
        Self { address: Address::ZERO, data: LogData::empty() }
    }
}

impl<T> Log<T>
where
    for<'a> &'a T: Into<LogData>,
{
    /// Creates a new log.
    #[inline]
    pub const fn new_from_event_unchecked(address: Address, data: T) -> Self {
        Self { address, data }
    }

    /// Creates a new log from an deserialized event.
    pub fn new_from_event(address: Address, data: T) -> Option<Self> {
        let this = Self::new_from_event_unchecked(address, data);
        (&this.data).into().is_valid().then_some(this)
    }

    /// Reserialize the data.
    #[inline]
    pub fn reserialize(&self) -> Log<LogData> {
        Log { address: self.address, data: (&self.data).into() }
    }
}

#[cfg(feature = "rlp")]
impl alloy_rlp::Encodable for Log {
    fn encode(&self, out: &mut dyn alloy_rlp::BufMut) {
        let payload_length =
            self.address.length() + self.data.data.length() + self.data.topics.length();

        alloy_rlp::Header { list: true, payload_length }.encode(out);
        self.address.encode(out);
        self.data.topics.encode(out);
        self.data.data.encode(out);
    }

    fn length(&self) -> usize {
        let payload_length =
            self.address.length() + self.data.data.length() + self.data.topics.length();
        payload_length + alloy_rlp::length_of_length(payload_length)
    }
}

#[cfg(feature = "rlp")]
impl<T> alloy_rlp::Encodable for Log<T>
where
    for<'a> &'a T: Into<LogData>,
{
    fn encode(&self, out: &mut dyn alloy_rlp::BufMut) {
        self.reserialize().encode(out)
    }

    fn length(&self) -> usize {
        self.reserialize().length()
    }
}

#[cfg(feature = "rlp")]
impl alloy_rlp::Decodable for Log {
    fn decode(buf: &mut &[u8]) -> Result<Self, alloy_rlp::Error> {
        let h = alloy_rlp::Header::decode(buf)?;
        let pre = buf.len();

        let address = alloy_rlp::Decodable::decode(buf)?;
        let topics = alloy_rlp::Decodable::decode(buf)?;
        let data = alloy_rlp::Decodable::decode(buf)?;

        if h.payload_length != pre - buf.len() {
            return Err(alloy_rlp::Error::Custom("did not consume exact payload"));
        }

        Ok(Self { address, data: LogData { topics, data } })
    }
}

#[cfg(feature = "rlp")]
#[cfg(test)]
mod tests {
    use super::*;
    use alloy_rlp::{Decodable, Encodable};

    #[test]
    fn test_roundtrip_rlp_log_data() {
        let log = Log::<LogData>::default();
        let mut buf = Vec::<u8>::new();
        log.encode(&mut buf);
        assert_eq!(Log::decode(&mut &buf[..]).unwrap(), log);
    }
}
```
```rs [./src/hex_literal.rs]
//! Hex literal macro implementation.
//!
//! Modified from the [`hex-literal`](https://github.com/RustCrypto/utils/tree/master/hex-literal)
//! crate to allow `0x` prefixes.

const fn next_hex_char(string: &[u8], mut pos: usize) -> Option<(u8, usize)> {
    while pos < string.len() {
        let raw_val = string[pos];
        pos += 1;
        let val = match raw_val {
            b'0'..=b'9' => raw_val - 48,
            b'A'..=b'F' => raw_val - 55,
            b'a'..=b'f' => raw_val - 87,
            b' ' | b'\r' | b'\n' | b'\t' => continue,
            0..=127 => panic!("Encountered invalid ASCII character"),
            _ => panic!("Encountered non-ASCII character"),
        };
        return Some((val, pos));
    }
    None
}

const fn next_byte(string: &[u8], pos: usize) -> Option<(u8, usize)> {
    let (half1, pos) = match next_hex_char(string, pos) {
        Some(v) => v,
        None => return None,
    };
    let (half2, pos) = match next_hex_char(string, pos) {
        Some(v) => v,
        None => panic!("Odd number of hex characters"),
    };
    Some(((half1 << 4) + half2, pos))
}

/// Strips the `0x` prefix from a hex string.
///
/// This function is an implementation detail and SHOULD NOT be called directly!
#[doc(hidden)]
pub const fn strip_hex_prefix(string: &[u8]) -> &[u8] {
    if let [b'0', b'x' | b'X', rest @ ..] = string {
        rest
    } else {
        string
    }
}

/// Compute length of a byte array which will be decoded from the strings.
///
/// This function is an implementation detail and SHOULD NOT be called directly!
#[doc(hidden)]
pub const fn len(strings: &[&[u8]]) -> usize {
    let mut i = 0;
    let mut len = 0;
    while i < strings.len() {
        let mut pos = 0;
        while let Some((_, new_pos)) = next_byte(strings[i], pos) {
            len += 1;
            pos = new_pos;
        }
        i += 1;
    }
    len
}

/// Decode hex strings into a byte array of pre-computed length.
///
/// This function is an implementation detail and SHOULD NOT be called directly!
#[doc(hidden)]
pub const fn decode<const LEN: usize>(strings: &[&[u8]]) -> [u8; LEN] {
    let mut i = 0;
    let mut buf = [0u8; LEN];
    let mut buf_pos = 0;
    while i < strings.len() {
        let mut pos = 0;
        while let Some((byte, new_pos)) = next_byte(strings[i], pos) {
            buf[buf_pos] = byte;
            buf_pos += 1;
            pos = new_pos;
        }
        i += 1;
    }
    if LEN != buf_pos {
        panic!("Length mismatch. Please report this bug.");
    }
    buf
}

/// Macro for converting sequence of string literals containing hex-encoded data
/// into an array of bytes.
#[macro_export]
macro_rules! hex {
    ($($s:literal)*) => {const {
        const STRINGS: &[&[u8]] = &[$( $crate::hex_literal::strip_hex_prefix($s.as_bytes()), )*];
        $crate::hex_literal::decode::<{ $crate::hex_literal::len(STRINGS) }>(STRINGS)
    }};
}
#[doc(hidden)] // Use `crate::hex` directly instead!
pub use crate::hex;

#[cfg(test)]
mod tests {
    #[test]
    fn single_literal() {
        assert_eq!(hex!("ff e4"), [0xff, 0xe4]);
    }

    #[test]
    fn empty() {
        let nothing: [u8; 0] = hex!();
        let empty_literals: [u8; 0] = hex!("" "" "");
        let expected: [u8; 0] = [];
        assert_eq!(nothing, expected);
        assert_eq!(empty_literals, expected);
    }

    #[test]
    fn upper_case() {
        assert_eq!(hex!("AE DF 04 B2"), [0xae, 0xdf, 0x04, 0xb2]);
        assert_eq!(hex!("FF BA 8C 00 01"), [0xff, 0xba, 0x8c, 0x00, 0x01]);
    }

    #[test]
    fn mixed_case() {
        assert_eq!(hex!("bF dd E4 Cd"), [0xbf, 0xdd, 0xe4, 0xcd]);
    }

    #[test]
    fn can_strip_prefix() {
        assert_eq!(hex!("0x1a2b3c"), [0x1a, 0x2b, 0x3c]);
        assert_eq!(hex!("0xa1" "0xb2" "0xc3"), [0xa1, 0xb2, 0xc3]);
    }

    #[test]
    fn multiple_literals() {
        assert_eq!(
            hex!(
                "01 dd f7 7f"
                "ee f0 d8"
            ),
            [0x01, 0xdd, 0xf7, 0x7f, 0xee, 0xf0, 0xd8]
        );
        assert_eq!(
            hex!(
                "ff"
                "e8 d0"
                ""
                "01 1f"
                "ab"
            ),
            [0xff, 0xe8, 0xd0, 0x01, 0x1f, 0xab]
        );
    }

    #[test]
    fn no_spacing() {
        assert_eq!(hex!("abf0d8bb0f14"), [0xab, 0xf0, 0xd8, 0xbb, 0x0f, 0x14]);
        assert_eq!(
            hex!("09FFd890cbcCd1d08F"),
            [0x09, 0xff, 0xd8, 0x90, 0xcb, 0xcc, 0xd1, 0xd0, 0x8f]
        );
    }

    #[test]
    fn allows_various_spacing() {
        // newlines
        assert_eq!(
            hex!(
                "f
                f
                d
                0
                e

                8
                "
            ),
            [0xff, 0xd0, 0xe8]
        );
        // tabs
        assert_eq!(hex!("9f	d		1		f07	3		01	"), [0x9f, 0xd1, 0xf0, 0x73, 0x01]);
        // spaces
        assert_eq!(hex!(" e    e d0  9 1   f  f  "), [0xee, 0xd0, 0x91, 0xff]);
    }

    #[test]
    const fn can_use_const() {
        const _: [u8; 4] = hex!("ff d3 01 7f");
    }
}
```
```rs [./src/postgres.rs]
//! Support for the [`postgres_types`] crate.
//!
//! **WARNING**: this module depends entirely on [`postgres_types`, which is not yet stable,
//! therefore this module is exempt from the semver guarantees of this crate.

use super::{FixedBytes, Sign, Signed};
use bytes::{BufMut, BytesMut};
use derive_more::Display;
use postgres_types::{accepts, to_sql_checked, FromSql, IsNull, ToSql, Type, WrongType};
use std::{
    error::Error,
    iter,
    str::{from_utf8, FromStr},
};

/// Converts `FixedBytes` to Postgres Bytea Type.
impl<const BITS: usize> ToSql for FixedBytes<BITS> {
    fn to_sql(&self, _: &Type, out: &mut BytesMut) -> Result<IsNull, BoxedError> {
        out.put_slice(&self[..]);
        Ok(IsNull::No)
    }

    accepts!(BYTEA);

    to_sql_checked!();
}

/// Converts `FixedBytes` From Postgres Bytea Type.
impl<'a, const BITS: usize> FromSql<'a> for FixedBytes<BITS> {
    accepts!(BYTEA);

    fn from_sql(_: &Type, raw: &'a [u8]) -> Result<Self, Box<dyn Error + Sync + Send>> {
        Ok(Self::try_from(raw)?)
    }
}

// https://github.com/recmo/uint/blob/6c755ad7cd54a0706d20f11f3f63b0d977af0226/src/support/postgres.rs#L22

type BoxedError = Box<dyn Error + Sync + Send + 'static>;

const fn rem_up(a: usize, b: usize) -> usize {
    let rem = a % b;
    if rem > 0 {
        rem
    } else {
        b
    }
}

fn last_idx<T: PartialEq>(x: &[T], value: &T) -> usize {
    x.iter().rposition(|b| b != value).map_or(0, |idx| idx + 1)
}

fn trim_end_vec<T: PartialEq>(vec: &mut Vec<T>, value: &T) {
    vec.truncate(last_idx(vec, value));
}

/// Error when converting to Postgres types.
#[derive(Clone, Debug, PartialEq, Eq, Display)]
pub enum ToSqlError {
    /// The value is too large for the type.
    #[display("Signed<{_0}> value too large to fit target type {_1}")]
    Overflow(usize, Type),
}

impl core::error::Error for ToSqlError {}

/// Convert to Postgres types.
///
/// Compatible [Postgres data types][dt] are:
///
/// * `BOOL`, `SMALLINT`, `INTEGER`, `BIGINT` which are 1, 16, 32 and 64 bit signed integers
///   respectively.
/// * `OID` which is a 32 bit unsigned integer.
/// * `DECIMAL` and `NUMERIC`, which are variable length.
/// * `MONEY` which is a 64 bit integer with two decimals.
/// * `BYTEA`, `BIT`, `VARBIT` interpreted as a big-endian binary number.
/// * `CHAR`, `VARCHAR`, `TEXT` as `0x`-prefixed big-endian hex strings.
/// * `JSON`, `JSONB` as a hex string compatible with the Serde serialization.
///
/// # Errors
///
/// Returns an error when trying to convert to a value that is too small to fit
/// the number. Note that this depends on the value, not the type, so a
/// [`Signed<256>`] can be stored in a `SMALLINT` column, as long as the values
/// are less than $2^{16}$.
///
/// # Implementation details
///
/// The Postgres binary formats are used in the wire-protocol and the
/// the `COPY BINARY` command, but they have very little documentation. You are
/// pointed to the source code, for example this is the implementation of the
/// the `NUMERIC` type serializer: [`numeric.c`][numeric].
///
/// [dt]:https://www.postgresql.org/docs/9.5/datatype.html
/// [numeric]: https://github.com/postgres/postgres/blob/05a5a1775c89f6beb326725282e7eea1373cbec8/src/backend/utils/adt/numeric.c#L1082
impl<const BITS: usize, const LIMBS: usize> ToSql for Signed<BITS, LIMBS> {
    fn to_sql(&self, ty: &Type, out: &mut BytesMut) -> Result<IsNull, BoxedError> {
        match *ty {
            // Big-endian simple types
            // Note `BufMut::put_*` methods write big-endian by default.
            Type::BOOL => out.put_u8(u8::from(bool::try_from(self.0)?)),
            Type::INT2 => out.put_i16(self.0.try_into()?),
            Type::INT4 => out.put_i32(self.0.try_into()?),
            Type::OID => out.put_u32(self.0.try_into()?),
            Type::INT8 => out.put_i64(self.0.try_into()?),

            Type::MONEY => {
                // Like i64, but with two decimals.
                out.put_i64(
                    i64::try_from(self.0)?
                        .checked_mul(100)
                        .ok_or(ToSqlError::Overflow(BITS, ty.clone()))?,
                );
            }

            // Binary strings
            Type::BYTEA => out.put_slice(&self.0.to_be_bytes_vec()),
            Type::BIT | Type::VARBIT => {
                // Bit in little-endian so the first bit is the least significant.
                // Length must be at least one bit.
                if BITS == 0 {
                    if *ty == Type::BIT {
                        // `bit(0)` is not a valid type, but varbit can be empty.
                        return Err(Box::new(WrongType::new::<Self>(ty.clone())));
                    }
                    out.put_i32(0);
                } else {
                    // Bits are output in big-endian order, but padded at the
                    // least significant end.
                    let padding = 8 - rem_up(BITS, 8);
                    out.put_i32(Self::BITS.try_into()?);
                    let bytes = self.0.as_le_bytes();
                    let mut bytes = bytes.iter().rev();
                    let mut shifted = bytes.next().unwrap() << padding;
                    for byte in bytes {
                        shifted |= if padding > 0 { byte >> (8 - padding) } else { 0 };
                        out.put_u8(shifted);
                        shifted = byte << padding;
                    }
                    out.put_u8(shifted);
                }
            }

            // Hex strings
            Type::CHAR | Type::TEXT | Type::VARCHAR => {
                out.put_slice(format!("{self:#x}").as_bytes());
            }
            Type::JSON | Type::JSONB => {
                if *ty == Type::JSONB {
                    // Version 1 of JSONB is just plain text JSON.
                    out.put_u8(1);
                }
                out.put_slice(format!("\"{self:#x}\"").as_bytes());
            }

            // Binary coded decimal types
            // See <https://github.com/postgres/postgres/blob/05a5a1775c89f6beb326725282e7eea1373cbec8/src/backend/utils/adt/numeric.c#L253>
            Type::NUMERIC => {
                // Everything is done in big-endian base 1000 digits.
                const BASE: u64 = 10000;

                let sign = match self.sign() {
                    Sign::Positive => 0x0000,
                    _ => 0x4000,
                };

                let mut digits: Vec<_> = self.abs().0.to_base_be(BASE).collect();
                let exponent = digits.len().saturating_sub(1).try_into()?;

                // Trailing zeros are removed.
                trim_end_vec(&mut digits, &0);

                out.put_i16(digits.len().try_into()?); // Number of digits.
                out.put_i16(exponent); // Exponent of first digit.

                out.put_i16(sign);
                out.put_i16(0); // dscale: Number of digits to the right of the decimal point.
                for digit in digits {
                    debug_assert!(digit < BASE);
                    #[allow(clippy::cast_possible_truncation)] // 10000 < i16::MAX
                    out.put_i16(digit as i16);
                }
            }

            // Unsupported types
            _ => {
                return Err(Box::new(WrongType::new::<Self>(ty.clone())));
            }
        };
        Ok(IsNull::No)
    }

    fn accepts(ty: &Type) -> bool {
        matches!(*ty, |Type::BOOL| Type::CHAR
            | Type::INT2
            | Type::INT4
            | Type::INT8
            | Type::OID
            | Type::FLOAT4
            | Type::FLOAT8
            | Type::MONEY
            | Type::NUMERIC
            | Type::BYTEA
            | Type::TEXT
            | Type::VARCHAR
            | Type::JSON
            | Type::JSONB
            | Type::BIT
            | Type::VARBIT)
    }

    to_sql_checked!();
}

/// Error when converting from Postgres types.
#[derive(Clone, Debug, PartialEq, Eq, Display)]
pub enum FromSqlError {
    /// The value is too large for the type.
    #[display("the value is too large for the Signed type")]
    Overflow,

    /// The value is not valid for the type.
    #[display("unexpected data for type {_0}")]
    ParseError(Type),
}

impl core::error::Error for FromSqlError {}

impl<'a, const BITS: usize, const LIMBS: usize> FromSql<'a> for Signed<BITS, LIMBS> {
    fn accepts(ty: &Type) -> bool {
        <Self as ToSql>::accepts(ty)
    }

    fn from_sql(ty: &Type, raw: &'a [u8]) -> Result<Self, Box<dyn Error + Sync + Send>> {
        Ok(match *ty {
            Type::BOOL => match raw {
                [0] => Self::ZERO,
                [1] => Self::try_from(1)?,
                _ => return Err(Box::new(FromSqlError::ParseError(ty.clone()))),
            },
            Type::INT2 => i16::from_be_bytes(raw.try_into()?).try_into()?,
            Type::INT4 => i32::from_be_bytes(raw.try_into()?).try_into()?,
            Type::OID => u32::from_be_bytes(raw.try_into()?).try_into()?,
            Type::INT8 => i64::from_be_bytes(raw.try_into()?).try_into()?,
            Type::MONEY => (i64::from_be_bytes(raw.try_into()?) / 100).try_into()?,

            // Binary strings
            Type::BYTEA => Self::try_from_be_slice(raw).ok_or(FromSqlError::Overflow)?,
            Type::BIT | Type::VARBIT => {
                // Parse header
                if raw.len() < 4 {
                    return Err(Box::new(FromSqlError::ParseError(ty.clone())));
                }
                let len: usize = i32::from_be_bytes(raw[..4].try_into()?).try_into()?;
                let raw = &raw[4..];

                // Shift padding to the other end
                let padding = 8 - rem_up(len, 8);
                let mut raw = raw.to_owned();
                if padding > 0 {
                    for i in (1..raw.len()).rev() {
                        raw[i] = (raw[i] >> padding) | (raw[i - 1] << (8 - padding));
                    }
                    raw[0] >>= padding;
                }
                // Construct from bits
                Self::try_from_be_slice(&raw).ok_or(FromSqlError::Overflow)?
            }

            // Hex strings
            Type::CHAR | Type::TEXT | Type::VARCHAR => Self::from_str(from_utf8(raw)?)?,

            // Hex strings
            Type::JSON | Type::JSONB => {
                let raw = if *ty == Type::JSONB {
                    if raw[0] == 1 {
                        &raw[1..]
                    } else {
                        // Unsupported version
                        return Err(Box::new(FromSqlError::ParseError(ty.clone())));
                    }
                } else {
                    raw
                };
                let str = from_utf8(raw)?;
                let str = if str.starts_with('"') && str.ends_with('"') {
                    // Stringified number
                    &str[1..str.len() - 1]
                } else {
                    str
                };
                Self::from_str(str)?
            }

            // Numeric types
            Type::NUMERIC => {
                // Parse header
                if raw.len() < 8 {
                    return Err(Box::new(FromSqlError::ParseError(ty.clone())));
                }
                let digits = i16::from_be_bytes(raw[0..2].try_into()?);
                let exponent = i16::from_be_bytes(raw[2..4].try_into()?);
                let sign = i16::from_be_bytes(raw[4..6].try_into()?);
                let dscale = i16::from_be_bytes(raw[6..8].try_into()?);
                let raw = &raw[8..];
                #[allow(clippy::cast_sign_loss)] // Signs are checked
                if digits < 0
                    || exponent < 0
                    || dscale != 0
                    || digits > exponent + 1
                    || raw.len() != digits as usize * 2
                {
                    return Err(Box::new(FromSqlError::ParseError(ty.clone())));
                }
                let mut error = false;
                let iter = raw.chunks_exact(2).filter_map(|raw| {
                    if error {
                        return None;
                    }
                    let digit = i16::from_be_bytes(raw.try_into().unwrap());
                    if !(0..10000).contains(&digit) {
                        error = true;
                        return None;
                    }
                    #[allow(clippy::cast_sign_loss)] // Signs are checked
                    Some(digit as u64)
                });
                #[allow(clippy::cast_sign_loss)]
                // Expression can not be negative due to checks above
                let iter = iter.chain(iter::repeat(0).take((exponent + 1 - digits) as usize));

                let mut value = Self::from_base_be(10000, iter)?;
                if sign == 0x4000 {
                    value = -value;
                }
                if error {
                    return Err(Box::new(FromSqlError::ParseError(ty.clone())));
                }

                value
            }

            // Unsupported types
            _ => return Err(Box::new(WrongType::new::<Self>(ty.clone()))),
        })
    }
}

#[cfg(test)]
mod test {
    use super::*;

    use crate::I256;

    #[test]
    fn positive_i256_from_sql() {
        assert_eq!(
            I256::from_sql(
                &Type::NUMERIC,
                &[
                    0x00, 0x01, // ndigits: 1
                    0x00, 0x00, // weight: 0
                    0x00, 0x00, // sign: 0x0000 (positive)
                    0x00, 0x00, // scale: 0
                    0x00, 0x01, // digit: 1
                ]
            )
            .unwrap(),
            I256::ONE
        );
    }

    #[test]
    fn positive_i256_to_sql() {
        let mut bytes = BytesMut::with_capacity(64);
        I256::ONE.to_sql(&Type::NUMERIC, &mut bytes).unwrap();
        assert_eq!(
            *bytes.freeze(),
            [
                0x00, 0x01, // ndigits: 1
                0x00, 0x00, // weight: 0
                0x00, 0x00, // sign: 0x0000 (positive)
                0x00, 0x00, // scale: 0
                0x00, 0x01, // digit: 1
            ],
        );
    }

    #[test]
    fn negative_i256_from_sql() {
        assert_eq!(
            I256::from_sql(
                &Type::NUMERIC,
                &[
                    0x00, 0x01, // ndigits: 1
                    0x00, 0x00, // weight: 0
                    0x40, 0x00, // sign: 0x4000 (negative)
                    0x00, 0x00, // scale: 0
                    0x00, 0x01, // digit: 1
                ]
            )
            .unwrap(),
            I256::MINUS_ONE
        );
    }

    #[test]
    fn negative_i256_to_sql() {
        let mut bytes = BytesMut::with_capacity(64);
        I256::MINUS_ONE.to_sql(&Type::NUMERIC, &mut bytes).unwrap();
        assert_eq!(
            *bytes.freeze(),
            [
                0x00, 0x01, // ndigits: 1
                0x00, 0x00, // weight: 0
                0x40, 0x00, // sign: 0x4000 (negative)
                0x00, 0x00, // scale: 0
                0x00, 0x01, // digit: 1
            ],
        );
    }
}
```
```rs [./src/aliases.rs]
//! Type aliases for common primitive types.

use crate::{FixedBytes, Signed, Uint};

pub use ruint::aliases::{U0, U1, U1024, U2048, U320, U384, U4096, U448};

macro_rules! int_aliases {
    ($($unsigned:ident, $signed:ident<$BITS:literal, $LIMBS:literal>),* $(,)?) => {$(
        #[doc = concat!($BITS, "-bit [unsigned integer type][Uint], consisting of ", $LIMBS, ", 64-bit limbs.")]
        pub type $unsigned = Uint<$BITS, $LIMBS>;

        #[doc = concat!($BITS, "-bit [signed integer type][Signed], consisting of ", $LIMBS, ", 64-bit limbs.")]
        pub type $signed = Signed<$BITS, $LIMBS>;

        const _: () = assert!($LIMBS == ruint::nlimbs($BITS));
    )*};
}

/// The 0-bit signed integer type, capable of representing 0.
pub type I0 = Signed<0, 0>;

/// The 1-bit signed integer type, capable of representing 0 and -1.
pub type I1 = Signed<1, 1>;

int_aliases! {
      U8,   I8<  8, 1>,
     U16,  I16< 16, 1>,
     U24,  I24< 24, 1>,
     U32,  I32< 32, 1>,
     U40,  I40< 40, 1>,
     U48,  I48< 48, 1>,
     U56,  I56< 56, 1>,
     U64,  I64< 64, 1>,

     U72,  I72< 72, 2>,
     U80,  I80< 80, 2>,
     U88,  I88< 88, 2>,
     U96,  I96< 96, 2>,
    U104, I104<104, 2>,
    U112, I112<112, 2>,
    U120, I120<120, 2>,
    U128, I128<128, 2>,

    U136, I136<136, 3>,
    U144, I144<144, 3>,
    U152, I152<152, 3>,
    U160, I160<160, 3>,
    U168, I168<168, 3>,
    U176, I176<176, 3>,
    U184, I184<184, 3>,
    U192, I192<192, 3>,

    U200, I200<200, 4>,
    U208, I208<208, 4>,
    U216, I216<216, 4>,
    U224, I224<224, 4>,
    U232, I232<232, 4>,
    U240, I240<240, 4>,
    U248, I248<248, 4>,
    U256, I256<256, 4>,

    U512, I512<512, 8>,
}

macro_rules! fixed_bytes_aliases {
    ($($(#[$attr:meta])* $name:ident<$N:literal>),* $(,)?) => {$(
        #[doc = concat!($N, "-byte [fixed byte-array][FixedBytes] type.")]
        $(#[$attr])*
        pub type $name = FixedBytes<$N>;
    )*};
}

fixed_bytes_aliases! {
    B8<1>,
    B16<2>,
    B32<4>,
    B64<8>,
    B96<12>,
    B128<16>,
    /// See [`crate::B160`] as to why you likely want to use
    /// [`Address`](crate::Address) instead.
    #[doc(hidden)]
    B160<20>,
    B192<24>,
    B224<28>,
    B256<32>,
    B512<64>,
    B1024<128>,
    B2048<256>,
}

/// A block hash.
pub type BlockHash = B256;

/// A block number.
pub type BlockNumber = u64;

/// A block timestamp.
pub type BlockTimestamp = u64;

/// A transaction hash is a keccak hash of an RLP encoded signed transaction.
#[doc(alias = "TransactionHash")]
pub type TxHash = B256;

/// The sequence number of all existing transactions.
#[doc(alias = "TransactionNumber")]
pub type TxNumber = u64;

/// The nonce of a transaction.
#[doc(alias = "TransactionNonce")]
pub type TxNonce = u64;

/// The index of transaction in a block.
#[doc(alias = "TransactionIndex")]
pub type TxIndex = u64;

/// Chain identifier type (introduced in EIP-155).
pub type ChainId = u64;

/// An account storage key.
pub type StorageKey = B256;

/// An account storage value.
pub type StorageValue = U256;

/// Solidity contract functions are addressed using the first four bytes of the
/// Keccak-256 hash of their signature.
pub type Selector = FixedBytes<4>;
```
```rs [./src/common.rs]
use crate::Address;

#[cfg(feature = "rlp")]
use alloy_rlp::{Buf, BufMut, Decodable, Encodable, EMPTY_STRING_CODE};

/// The `to` field of a transaction. Either a target address, or empty for a
/// contract creation.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "arbitrary", derive(derive_arbitrary::Arbitrary, proptest_derive::Arbitrary))]
#[doc(alias = "TransactionKind")]
pub enum TxKind {
    /// A transaction that creates a contract.
    #[default]
    Create,
    /// A transaction that calls a contract or transfer.
    Call(Address),
}

impl From<Option<Address>> for TxKind {
    /// Creates a `TxKind::Call` with the `Some` address, `None` otherwise.
    #[inline]
    fn from(value: Option<Address>) -> Self {
        match value {
            None => Self::Create,
            Some(addr) => Self::Call(addr),
        }
    }
}

impl From<Address> for TxKind {
    /// Creates a `TxKind::Call` with the given address.
    #[inline]
    fn from(value: Address) -> Self {
        Self::Call(value)
    }
}

impl From<TxKind> for Option<Address> {
    /// Returns the address of the contract that will be called or will receive the transfer.
    #[inline]
    fn from(value: TxKind) -> Self {
        value.to().copied()
    }
}

impl TxKind {
    /// Returns the address of the contract that will be called or will receive the transfer.
    pub const fn to(&self) -> Option<&Address> {
        match self {
            Self::Create => None,
            Self::Call(to) => Some(to),
        }
    }

    /// Consumes the type and returns the address of the contract that will be called or will
    /// receive the transfer.
    pub const fn into_to(self) -> Option<Address> {
        match self {
            Self::Create => None,
            Self::Call(to) => Some(to),
        }
    }

    /// Returns true if the transaction is a contract creation.
    #[inline]
    pub const fn is_create(&self) -> bool {
        matches!(self, Self::Create)
    }

    /// Returns true if the transaction is a contract call.
    #[inline]
    pub const fn is_call(&self) -> bool {
        matches!(self, Self::Call(_))
    }

    /// Calculates a heuristic for the in-memory size of this object.
    #[inline]
    pub const fn size(&self) -> usize {
        core::mem::size_of::<Self>()
    }
}

#[cfg(feature = "rlp")]
impl Encodable for TxKind {
    fn encode(&self, out: &mut dyn BufMut) {
        match self {
            Self::Call(to) => to.encode(out),
            Self::Create => out.put_u8(EMPTY_STRING_CODE),
        }
    }

    fn length(&self) -> usize {
        match self {
            Self::Call(to) => to.length(),
            Self::Create => 1, // EMPTY_STRING_CODE is a single byte
        }
    }
}

#[cfg(feature = "rlp")]
impl Decodable for TxKind {
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self> {
        if let Some(&first) = buf.first() {
            if first == EMPTY_STRING_CODE {
                buf.advance(1);
                Ok(Self::Create)
            } else {
                let addr = <Address as Decodable>::decode(buf)?;
                Ok(Self::Call(addr))
            }
        } else {
            Err(alloy_rlp::Error::InputTooShort)
        }
    }
}

#[cfg(feature = "serde")]
impl serde::Serialize for TxKind {
    fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        self.to().serialize(serializer)
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::Deserialize<'de> for TxKind {
    fn deserialize<D: serde::Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        Ok(Option::<Address>::deserialize(deserializer)?.into())
    }
}
```
