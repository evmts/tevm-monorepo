const addressRegex = /^0x[a-fA-F0-9]{40}$/;
export function isAddress(address) {
    return addressRegex.test(address);
}
//# sourceMappingURL=isAddress.js.map