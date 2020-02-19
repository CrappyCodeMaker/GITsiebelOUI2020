// JavaScript File for Facility UIJ
// Automatically produced by siebelrc

var _SWEmsgAryOffline = new Array();
var _SWEbMsgInitOffline = false;

function _SWEgetGlobalMsgAryOffline()
{
   if (! _SWEbMsgInitOffline)
   {
      _SWEbMsgInitOffline = true;
      _SWEmsgAryOffline["IDS_DOUI_ERR_NETWORK_CONN"] = "Unable to synchronize. Please check your network connection.(SBL-UIJ-00100)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_OFFLINE_PKG"] = "Downloading of the offline package failed. Please check your internet connection, empty the cache, and try again.(SBL-UIJ-00101)";
      _SWEmsgAryOffline["IDS_DOUI_UPSYNC_REC"] = "Please synchronize records created offline to the server before navigating to Online mode.(SBL-UIJ-00102)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_INTERN_CONN"] = "Please connect to the internet to go online.(SBL-UIJ-00103)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_DB_NO_SUPPORT"] = "Databases are not supported in this browser.(SBL-UIJ-00104)";
      _SWEmsgAryOffline["IDS_DOUI_FLD_MANDTY"] = "Please enter a value for  %1, which is required.(SBL-UIJ-00105)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_OFFLINE_PKG_SRVR"] = "Failed to get offline package from server. Please verify offline repository configuration.(SBL-UIJ-00106)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_METADATA_SRVR"] = "Failed to get metadata from server. Please check that appropriate metadata is configured on the server.(SBL-UIJ-00107)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_OPRN_NOT_SUPPT"] = "This operation is currently not supported in offline mode.(SBL-UIJ-00108)";
      _SWEmsgAryOffline["IDS_DOUI_NO_REC_UPD"] = "Error reading barcode. Data not captured.(SBL-UIJ-00109)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_SYNC"] = "Not able to synchronize. Confirm server availability and try again.(SBL-UIJ-00110)";
      _SWEmsgAryOffline["IDS_DOUI_SYNC_DNE"] = "Synchronization is successful. Please contact administrator to verify logs.(SBL-UIJ-00111)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_SESSN_EXPIRED"] = "Login session expired. Please close, then restart the browser and login again to synchronize.(SBL-UIJ-00112)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_SRF_EXPIRED"] = "The Siebel repository file was changed on the server since your last synchronization. A full download will be performed.(SBL-UIJ-00113)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_RESP_CHNG"] = "Your user responsibilities have changed. A full download will be performed.(SBL-UIJ-00114)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_DATA_OUTDTD"] = "Current data is outdated. A full download will be performed.(SBL-UIJ-00115)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_INVALID_RESPONSE"] = "Received an invalid server response for request: %1.(SBL-UIJ-00116)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_APPL_CACHE_DNWLD"] = "The application cache download failed.(SBL-UIJ-00117)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_UNAUTH_USER"] = "You are not authorized to perform this synchronization.(SBL-UIJ-00118)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_NODECHANGED_BKUP_DATA"] = "The remote node has changed. A full download will be performed.(SBL-UIJ-00119)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_UPOSCHANGED_BKUP_DATA"] = "Your user position has changed. A full download will be performed.(SBL-UIJ-00120)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_INSUFFICIENT_MEMORY"] = "Insufficient memory. Disconnected mode won't be supported.(SBL-UIJ-00121)";
      _SWEmsgAryOffline["SSAPhmaErrDetailProd"] = "At least one product must be detailed before submitting.";
      _SWEmsgAryOffline["SSAPhmaErrNoSignAfterToday"] = "Cannot capture a signature if the Call Date is later than Today.";
      _SWEmsgAryOffline["SSAPhmaErrNoSignUnlessOwn"] = "You may not capture a signature for a call that you do not own.";
      _SWEmsgAryOffline["IDS_LS_TARGET_PRIORITY_VALIDATION_FAILED"] = "Priority values for products detailed are required to be unique and in sequential order. Please review your product detail priority values to ensure they are not violating this requirement.";
      _SWEmsgAryOffline["SSAFReqFieldNotExist"] = "%1 is a required Field.  Enter an appropriate value.(SBL-UIJ-00126)";
      _SWEmsgAryOffline["SSAPhrmaErrRefNumIfSamp"] = "Can not submit visit to %1.Sample reference number is required if samples are dropped.";
      _SWEmsgAryOffline["SSAPhmaErrCallNeedsSign"] = "Can not submit this call to %1.A paper signature or an electronic signature is required to submit this call.";
      _SWEmsgAryOffline["SSAPharmaSampleTxnsOnReconciledInventory"] = "This sample transaction cannot be submitted against a reconciled period. Please change the transaction date to fall within an unreconciled or active period.";
      _SWEmsgAryOffline["SSAPhrmaErrNotValidProfTypeForSRE"] = "A signature cannot be captured for this type of contact.";
      _SWEmsgAryOffline["SSAPhmaErrMaxQtyPerCallExceeded"] = "Change the quantity value. You are allowed to sample only %2 of %1 per call.";
      _SWEmsgAryOffline["SSAPhmaErrMaxQtyPerAllocPeriodExceeded"] = "Change the quantity value. You cannot sample %1 as it exceeds available quantity - %2.";
      _SWEmsgAryOffline["SSAPhrmaErrOKToSampleFlgNotSet"] = "Professional is not allowed to be sampled. Remove samples before submitting the call.";
      _SWEmsgAryOffline["SSAPhrmaErrLicFldsNotFilled"] = "%1 is a required field.(SBL-UIJ-00134)";
      _SWEmsgAryOffline["SSAPhrmaErrLicNumExpDtExpired"] = "The License Number for this contact has expired.";
      _SWEmsgAryOffline["SSAPhrmaErrDEANumNotValid"] = "The DEA Number for this address is not valid. Please enter a valid one.";
      _SWEmsgAryOffline["SSAPhrmaErrDEANumFldsNotFilled"] = "%1 at this contact's address is a required field.";
      _SWEmsgAryOffline["SSAPhrmaErrDEANumExpDtExpired"] = "The DEA number for this Contact's Address has expired. Update DEA number for the selected address.";
      _SWEmsgAryOffline["SSAPhmaValdnMsgLotCutOff"] = "Select a different Lot#. The Lot#: '%1' selected for sample: '%2' is nearing expiration.";
      _SWEmsgAryOffline["SSAPhrmaErrProfProfileNotFilled"] = "The Contact's Last Name, First Name, Title and Address fields are required in order to capture a signature.";
      _SWEmsgAryOffline["SSAPhmaErrSampDropSign"] = "At least one sample must be dropped or requested in order to capture a signature.";
      _SWEmsgAryOffline["SSAPhmaCallValidationFailed"] = "Check Validation Results for corrective action to proceed.(SBL-UIJ-00142)";
      _SWEmsgAryOffline["SSAPhrmaErrLicStatusInactive"] = "The License Number for this Contact is not Active.";
      _SWEmsgAryOffline["IDS_PHA_ERR_SIGN_REQD"] = "'%1' is a required field.  Please enter a value for the field.(SBL-UIJ-00144)";
      _SWEmsgAryOffline["IDS_PHA_ERR_SIGN_TOO_BIG"] = "Your entry for field '%1' is too long to fit in a UTF-8 encoded enterprise database.  Please try again with a shorter entry.(SBL-UIJ-00145)";
      _SWEmsgAryOffline["IDS_LSMOBILE_CL_ACCOUNT_CONTACT_REQUIRED"] = "You must choose either Contact or Account to create the call, but not both.(SBL-UIJ-00146)";
      _SWEmsgAryOffline["SSAPhmaValdnMsgInValidEmpToSample"] = "You are not allowed to sample. Contact your Samples Compliance Group.";
      _SWEmsgAryOffline["SSAPhmaValidationRulePassed"] = "The validation rule check was successful";
      _SWEmsgAryOffline["SSAPhmaValidationRuleIgnored"] = "The validation rule was ignored as it is not applicable to the current call";
      _SWEmsgAryOffline["IDS_LS_PHARMA_EXPIRED_LOT"] = "Sample %2 Lot# %1 has expired. Remove this item and select sample with a valid Lot#";
      _SWEmsgAryOffline["IDS_LS_PHARMA_LOT_NUMBER_REQ"] = "'%1' is required for sample '%2'";
      _SWEmsgAryOffline["SSAOMErrDataTooLong"] = "Value too long for field '%1' (maximum size %2).(SBL-UIJ-00152)";
      _SWEmsgAryOffline["SSAOMErrUnknownBCMethod"] = "The specialized method '%1' is not supported on this business component.(SBL-UIJ-00153)";
      _SWEmsgAryOffline["SSASqlErrFieldReadOnly"] = "This operation is not available for read only field '%1'.(SBL-UIJ-00154)";
      _SWEmsgAryOffline["SSASqlErrUpdMode"] = "Invalid operation when not in update mode.\n\nPlease continue or ask your systems administrator to check your application configuration if the problem persists.(SBL-UIJ-00155)";
      _SWEmsgAryOffline["SSASqlErrNotExecuted"] = "Invalid operation when not executed.(SBL-UIJ-00156)";
      _SWEmsgAryOffline["SSAOMErrNoUpdate"] = "You cannot currently update this record. Please check the No Update properties on the Applet, Business Component, and Link.(SBL-UIJ-00157)";
      _SWEmsgAryOffline["SSASqlErrTrxInProgress"] = "A transaction is already in progress(SBL-UIJ-00158)";
      _SWEmsgAryOffline["SSAOMErrFieldInActive"] = "Field %1 is not activated in Business Component %2.(SBL-UIJ-00159)";
      _SWEmsgAryOffline["IDS_SWE_INVALID_OLD_PASSWORD"] = "The current password that you entered is incorrect. Please enter again.(SBL-UIJ-00160)";
      _SWEmsgAryOffline["IDS_SWE_NO_COMMIT_PENDING"] = "You cannot modify the record on this page. This is likely because you used the browser back and forward buttons to reach this page. Please use the Edit/New buttons within the application to modify records.(SBL-UIJ-00161)";
      _SWEmsgAryOffline["SSASqlErrValidation"] = "The value '%1' for field '%2' is required to be '%3'.(SBL-UIJ-00162)";
      _SWEmsgAryOffline["IDS_ERR_FS_MISSING_SR"] = "Error Text: Invalid Service Request. A valid Service Request is needed to generate an order.(SBL-UIJ-00163)";
      _SWEmsgAryOffline["IDS_FS_CHECKTRUNK_NO_EMPLOYEE"] = "Check Trunk cannot be performed as no employee is found.(SBL-UIJ-00164)";
      _SWEmsgAryOffline["IDS_IVC_ERR_INVOICE_START_DATE"] = "Invalid Invoice Start Date.(SBL-UIJ-00165)";
      _SWEmsgAryOffline["IDS_IVC_ERR_INVOICE_SCHEDULE"] = "Invalid Invoice Schedule.(SBL-UIJ-00166)";
      _SWEmsgAryOffline["IDS_IVC_ERR_INVOICE_DAY"] = "Invalid Invoice Timing.(SBL-UIJ-00167)";
      _SWEmsgAryOffline["IDS_FS_ERR_NO_TRUNK_INVLOC"] = "Cannot find trunk inventory location for the activity owner.(SBL-UIJ-00168)";
      _SWEmsgAryOffline["IDS_FS_ERR_MTHD_MISSING_ARG"] = "Method %1 requires a value for argument %2.(SBL-UIJ-00169)";
      _SWEmsgAryOffline["SSASqlErrDupConflict"] = "A record that contains identical values to the record you have created already exists.\n\nIf you would like to enter a new record, please ensure that the field values are unique.(SBL-UIJ-00170)";
      _SWEmsgAryOffline["SSASqlErrEndTrx"] = "An error occurred trying to commit/rollback a database transaction(SBL-UIJ-00171)";
      _SWEmsgAryOffline["SSAPhmaValdnMsgStopSampling"] = "Remove the sample line item for product %1. You are not allowed to sample or submit request for product %1.(SBL-UIJ-00172)";
      _SWEmsgAryOffline["IDS_CLIENT_GO_OFFLINE"] = "Go Offline";
      _SWEmsgAryOffline["IDS_CLIENT_GO_ONLINE"] = "Go Online";
      _SWEmsgAryOffline["IDS_CLIENT_CONTINUE_WORK_OFFLINE"] = "Continue to work Offline";
      _SWEmsgAryOffline["IDS_CLIENT_UPLOAD_GO_ONLINE"] = "Upload and Go Online";
      _SWEmsgAryOffline["IDS_CLIENT_SYNC_STAY_OFFLINE"] = "Sync and stay Offline";
      _SWEmsgAryOffline["IDS_CLIENT_UPLOAD_ONLY_STAY_OFFLINE"] = "Upload only and stay Offline";
      _SWEmsgAryOffline["IDS_CLIENT_LOG"] = "Log";
      _SWEmsgAryOffline["IDS_DOUI_ERR_BO_FILTER_CHNG"] = "BusObj Filters has changed. A full download will be performed.(SBL-UIJ-00180)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_BC_FILTER_CHNG"] = "BusComp Filters has changed. A full download will be performed.(SBL-UIJ-00181)";
      _SWEmsgAryOffline["IDS_LS_PHARMA_EDT_RSP_REQD"] = "Response for Presentation Details is required to Submit the Call. Please enter an appropriate value.(SBL-UIJ-00182)";
      _SWEmsgAryOffline["IDS_DOUI_ERR_CONTACT_REQD"] = "Please Add Contact(SBL-UIJ-00183)";
      _SWEmsgAryOffline["IDS_SALES_CONTACT_PROSPECT_REQD"] = "Specify either a Contact Last Name or a Prospect Last Name.Both fields cannot be empty.(SBL-UIJ-00184)";
      _SWEmsgAryOffline["IDS_PROGRESS_APPCACHE_TITLE"] = "Preparing for offline usage";
      _SWEmsgAryOffline["IDS_PROGRESS_APPCACHE_FILES"] = "%1 of %2 files downloaded";
      _SWEmsgAryOffline["IDS_PROGRESS_SYNCDATA_TITLE"] = "Synchronizing data";
      _SWEmsgAryOffline["IDS_PROGRESS_DOWNLOAD_METADATA"] = "Downloading application configuration";
      _SWEmsgAryOffline["IDS_PROGRESS_DOWNLOAD_DATA"] = "Downloading data";
      _SWEmsgAryOffline["IDS_PROGRESS_SAVE_METADATA"] = "Saving application configuration";
      _SWEmsgAryOffline["IDS_PROGRESS_SAVE_DATA"] = "Saving data";
      _SWEmsgAryOffline["IDS_PROGRESS_LOAD_DB"] = "%1 of %2 objects loaded";
      _SWEmsgAryOffline["IDS_PROGRESS_GET_TXN_STATUS"] = "Validating data integrity";
      _SWEmsgAryOffline["IDS_PROGRESS_UPLOAD_DATA"] = "Uploading data";
      _SWEmsgAryOffline["IDS_PROGRESS_RELOAD_DB_TITLE"] = "Preparing offline data";
      _SWEmsgAryOffline["SSAOMErrBoundedPick"] = "The value entered in field '%2' of buscomp '%3' does not match any value in the bounded picl list '%1'(SBL-UIJ-00196)";
      _SWEmsgAryOffline["IDS_DOUI_SHADOW_API_ERROR"] = "The specialized method '%1' is not supported in offline.";
   }
   return _SWEmsgAryOffline;
}
function _SWEgetMessageOffline(key)
{
   ary = _SWEgetGlobalMsgAryOffline();
   return ary[key];
}
