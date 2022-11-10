function applyExtraSetup(sequelize) {
	const {
		UserRoles,
		Users,
		UserStatuses,
		Categories,
		Proposals,
		ProposalStatuses,
		Missions,
		MissionBudget,
		MissionCategories,
		MissionFundingType,
		MissionType,
		MissionApplicants,
		MissionFiles,
		Milestones,
		MilestoneStatuses,
		MilestonePaymentStatuses,
		Evidences,
		EvidencesFiles,
		Transactions,
		Disputes,
		UserSkills,
		UserFiles,
		UserFiles2,
		UserFiles3,
		BookmarkedUsers,
		BookmarkedMissions,
		UserEmployment,
		UsersCategories,
		UserReview,
		ChatsPrivate,
		MessagesGroup,
		Messages,
	} = sequelize.models;

	UserRoles.hasMany(Users, { foreignKey: 'roleId', as: 'roles' });
	Users.belongsTo(UserRoles, { foreignKey: 'roleId', as: 'roles' });

	UserStatuses.hasMany(Users, { foreignKey: 'statusId', as: 'statuses' });
	Users.belongsTo(UserStatuses, { foreignKey: 'statusId', as: 'statuses' });

	MissionBudget.hasMany(Missions, { foreignKey: 'budgetId' });
	Missions.belongsTo(MissionBudget, { foreignKey: 'budgetId' });

	Users.hasMany(Missions, { foreignKey: 'userId', as: 'missions' });
	Missions.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

	Users.hasMany(UserEmployment, { foreignKey: 'userId', as: 'employments' });
	UserEmployment.belongsTo(Users, { foreignKey: 'userId', as: 'employments' });

	Users.hasMany(UserFiles, { foreignKey: 'userId', as: 'files' });
	UserFiles.belongsTo(Users, { foreignKey: 'userId', as: 'files' });

	Users.hasMany(UserSkills, { foreignKey: 'userId', as: 'skills' });
	UserSkills.belongsTo(Users, { foreignKey: 'userId', as: 'skills' });

	Users.hasMany(UserFiles2, { foreignKey: 'userId', as: 'selfyFiles' });
	UserFiles2.belongsTo(Users, { foreignKey: 'userId', as: 'selfyFiles' });

	Users.hasMany(UserFiles3, { foreignKey: 'userId', as: 'licenseFiles' });
	UserFiles3.belongsTo(Users, { foreignKey: 'userId', as: 'licenseFiles' });

	Users.hasMany(BookmarkedUsers, {
		onDelete: 'cascade',
		foreignKey: 'userId',
		as: 'bookmarks',
	});
	BookmarkedUsers.belongsTo(Users, { foreignKey: 'userBookmarkId', as: 'user' });

	Users.hasMany(BookmarkedMissions, {
		onDelete: 'cascade',
		foreignKey: 'userId',
		as: 'missionBookmarks',
	});
	BookmarkedMissions.belongsTo(Missions, { foreignKey: 'missionId', as: 'mission' });

	Users.hasMany(UserReview, { onDelete: 'cascade', foreignKey: 'userId', as: 'user' });
	UserReview.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

	Missions.hasMany(UserReview, { onDelete: 'cascade', foreignKey: 'missionId', as: 'review' });
	UserReview.belongsTo(Missions, { foreignKey: 'missionId', as: 'mission' });

	Proposals.hasMany(UserReview, { onDelete: 'cascade', foreignKey: 'proposalId', as: 'review' });
	UserReview.belongsTo(Proposals, { foreignKey: 'proposalId', as: 'proposal' });

	Users.hasMany(UserReview, { onDelete: 'cascade', foreignKey: 'receiverId', as: 'receiver' });
	UserReview.belongsTo(Users, { foreignKey: 'receiverId', as: 'receiver' });

	Categories.belongsTo(Categories, {
		as: 'parent',
		foreignKey: 'parent_id',
		targetKey: 'id',
	});
	Categories.hasMany(Categories, {
		as: 'children',
		foreignKey: 'parent_id',
	});

	Missions.belongsToMany(Categories, {
		through: MissionCategories,
		onDelete: 'cascade',
		as: 'cats',
		foreignKey: 'missionId',
	});
	Categories.belongsToMany(Missions, {
		through: MissionCategories,
		as: 'mission',
		foreignKey: 'catId',
	});

	Users.belongsToMany(Categories, {
		through: UsersCategories,
		onDelete: 'cascade',
		as: 'cats',
		foreignKey: 'userId',
	});
	Categories.belongsToMany(Users, {
		through: UsersCategories,
		as: 'users',
		foreignKey: 'catId',
	});

	MissionFundingType.hasMany(Missions, {
		foreignKey: 'missionFundingTypeId',
		as: 'missionFundingType',
	});
	Missions.belongsTo(MissionFundingType, {
		foreignKey: 'missionFundingTypeId',
		as: 'missionFundingType',
	});

	MissionType.hasMany(Missions, { foreignKey: 'missionTypeId', as: 'missionType' });
	Missions.belongsTo(MissionType, { foreignKey: 'missionTypeId', as: 'missionType' });

	Missions.hasMany(MissionFiles, { foreignKey: 'missionId', as: 'missionFiles' });
	MissionFiles.belongsTo(Missions, { foreignKey: 'missionId', as: 'missionFiles' });

	Missions.belongsToMany(Users, {
		through: MissionApplicants,
		onDelete: 'cascade',
		as: 'missions',
		foreignKey: 'missionId',
	});
	Users.belongsToMany(Missions, {
		through: MissionApplicants,
		as: 'users',
		foreignKey: 'userId',
	});

	ProposalStatuses.hasMany(Proposals, { foreignKey: 'statusId' });
	Proposals.belongsTo(ProposalStatuses, { foreignKey: 'statusId', as: 'status' });

	MilestoneStatuses.hasMany(Milestones, { foreignKey: 'statusId' });
	Milestones.belongsTo(MilestoneStatuses, { foreignKey: 'statusId', as: 'status' });

	MilestonePaymentStatuses.hasMany(Milestones, { foreignKey: 'paymentStatusId' });
	Milestones.belongsTo(MilestonePaymentStatuses, { foreignKey: 'paymentStatusId' });

	Proposals.hasMany(Milestones, { foreignKey: 'proposalsId', as: 'milestones' });
	Milestones.belongsTo(Proposals, { foreignKey: 'proposalsId', as: 'proposal' });

	Users.hasMany(Proposals, { foreignKey: 'userId', as: 'proposals' });
	Proposals.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

	Missions.hasMany(Proposals, { foreignKey: 'missionId', as: 'proposal' });
	Proposals.belongsTo(Missions, { foreignKey: 'missionId', as: 'mission' });

	Milestones.hasOne(Evidences, { foreignKey: 'milestoneId', as: 'evidences' });
	Evidences.belongsTo(Milestones, { foreignKey: 'milestoneId' });

	Evidences.hasMany(EvidencesFiles, { foreignKey: 'evidenceId', as: 'evidenceFiles' });
	EvidencesFiles.belongsTo(Evidences, { foreignKey: 'evidenceId', as: 'evidenceFiles' });

	Milestones.hasMany(Transactions, { foreignKey: 'milestoneId' });
	Transactions.belongsTo(Milestones, { foreignKey: 'milestoneId', as: 'milestone' });

	Users.hasMany(Transactions, { foreignKey: 'userPaidId' });
	Transactions.belongsTo(Users, { foreignKey: 'userPaidId', as: 'userPaid' });

	Users.hasMany(Transactions, { foreignKey: 'userReceivedId' });
	Transactions.belongsTo(Users, { foreignKey: 'userReceivedId', as: 'userReceived' });

	Milestones.hasMany(Disputes, { foreignKey: 'milestoneId', as: 'dispute' });
	Disputes.belongsTo(Milestones, { foreignKey: 'milestoneId', as: 'milestone' });

	//users MSG
	Users.hasMany(Messages, { foreignKey: 'userId', as: 'messages' });
	Messages.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

	//MSG to Private Chat
	ChatsPrivate.hasMany(Messages, { foreignKey: 'chatPrivateId', as: 'messages' });
	Messages.belongsTo(ChatsPrivate, { foreignKey: 'chatPrivateId', as: 'chatPrivate' });

	//Users to Private Chat
	Users.hasMany(ChatsPrivate, { onDelete: 'cascade', foreignKey: 'senderId' });
	ChatsPrivate.belongsTo(Users, { foreignKey: 'senderId', as: 'sender' });

	Users.hasMany(ChatsPrivate, { onDelete: 'cascade', foreignKey: 'receiverId' });
	ChatsPrivate.belongsTo(Users, { foreignKey: 'receiverId', as: 'receiver' });

	Users.hasMany(ChatsPrivate, { onDelete: 'cascade', foreignKey: 'lastMessageOwnerId' });
	ChatsPrivate.belongsTo(Users, { foreignKey: 'lastMessageOwnerId', as: 'lastMessageOwner' });

	Users.hasMany(MessagesGroup, { onDelete: 'cascade', foreignKey: 'senderId' });
	MessagesGroup.belongsTo(Users, { foreignKey: 'senderId', as: 'sender' });
}

module.exports = { applyExtraSetup };
