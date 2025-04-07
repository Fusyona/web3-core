import { keccak256, toUtf8Bytes } from "ethers"

function role(name: string) {
    return keccak256(toUtf8Bytes(name))
}

export const roles = {
    MINTER : role("MINTER_ROLE"),
    CREATOR : role("CREATOR_ROLE"),
    MODERATOR : role("MODERATOR_ROLE")
}
