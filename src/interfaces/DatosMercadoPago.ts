export interface DatosMercadoPago {
    id: String | null,
	dateCreated: Date,
	dateApproved: Date,
	dateLastUpdated: Date,
	paymentTypeId: String,
	paymentMethodId: String,
	status: String,
	statusDetail: String
}