const getOtherName = (participants, myId) => {
    return getOther(participants, myId).name
}

const getOther = (participants, myId) => {
    return participants.filter((participant) => participant.userId !== myId)[0]
}

export { getOtherName, getOther }
