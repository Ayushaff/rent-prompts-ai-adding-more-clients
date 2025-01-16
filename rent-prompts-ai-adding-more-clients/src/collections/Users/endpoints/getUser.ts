

export const getUser = async (req) => {
  const { payload, user } = req;

  if (!user) {
      return Response.json({success: false, error: 'Unauthorized User' }, { status: 401 });
  }

    let filename = user?.profileImage?.filename || ''
  filename = filename
    ? `${process.env.PAYLOAD_PUBLIC_CLOUDFLARE_PUBLIC_R2}/${filename}`
    : "";

  const sharedApps = user.members.reduce((uniqueApps, member) => {
    member.rappAccess.forEach((access) => uniqueApps.add(access.rappId));
    return uniqueApps;
  }, new Set()).size;

  const associatedWith = typeof user.associatedWith === 'object'
    ? user.associatedWith?.id
    : (user.associatedWith || null); // Default to null if undefined

  try {
    const data = {
      id: user.id,
      name: user.user_name,
      email: user.email,
      role: user.role,
      coinBalance: user?.coinBalance,
      domain: user.domain,
      members: user.members.length,
      associateWith: associatedWith,
      profileImage: filename,
      tokens: user.tokens,
      sharedApps: sharedApps,
    }
      return Response.json({success: true, message: 'User data fetched successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
      return Response.json({success: true, error: 'Error in fetching loggedIn data' }, { status: 500 });
  }
};