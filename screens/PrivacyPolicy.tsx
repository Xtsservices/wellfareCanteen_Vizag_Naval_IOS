import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import Header from './header';
import DownNavbar from './downNavbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#666',
  BACKGROUND: '#fff',
  BORDER: '#E0E0E0',
  MENU_BG: '#F5F5F5',
};

// Types
type PrivacyPolicyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PrivacyPolicy'
>;

interface PrivacyPolicyScreenProps {
  navigation: PrivacyPolicyScreenNavigationProp;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({navigation}) => {
  const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
};

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.lastUpdated}>Last updated on: 16.07.2025</Text>
          <Text style={styles.sectionText}>
            This privacy policy (“Policy”) relates to the manner Industrial Wet Canteens Welfare Department, Naval Dockyard (“we”, “us”, “our”) in which we use, handle and process the data that you provide us in connection with using the products or services we offer. By using this website or by availing goods or services offered by us, you agree to the terms and conditions of this Policy, and consent to our use, storage, disclosure, and transfer of your information or data in the manner described in this Policy.
          </Text>
          <Text style={styles.sectionText}>
            We are committed to ensuring that your privacy is protected in accordance with applicable laws and regulations. We urge you to acquaint yourself with this Policy to familiarize yourself with the manner in which your data is being handled by us.
          </Text>
          <Text style={styles.sectionText}>
            Industrial Wet Canteens Welfare Department, Naval Dockyard may change this Policy periodically and we urge you to check this page for the latest version of the Policy in order to keep yourself updated.
          </Text>

          <Text style={styles.sectionTitle}>What data is being collected</Text>
          <Text style={styles.sectionText}>
            We may collect the following information from you:
          </Text>
          <Text style={styles.listItem}>● Name</Text>
          <Text style={styles.listItem}>● Contact information including address and email address</Text>
          <Text style={styles.listItem}>● Demographic information or, preferences or interests</Text>
          <Text style={styles.listItem}>● Personal Data or Other information relevant/required for providing the goods or services to you</Text>
          <Text style={styles.listItem}>● The meaning of Personal Data will be as defined under relevant Indian laws</Text>
          <Text style={styles.sectionText}>
            Note: Notwithstanding anything under this Policy—as required under applicable Indian laws, we will not be storing any credit card, debit card or any other similar card data of yours. Please also note that all data or information collected from you will be strictly in accordance with applicable laws and guidelines.
          </Text>

          <Text style={styles.sectionTitle}>What we do with the data we gather</Text>
          <Text style={styles.sectionText}>
            We require this data to provide you the services offered by us including but not limited, for the below set out purposes:
          </Text>
          <Text style={styles.listItem}>● Internal record keeping.</Text>
          <Text style={styles.listItem}>● For improving our services.</Text>
          <Text style={styles.listItem}>● For providing updates to you regarding our services including any special offers.</Text>
          <Text style={styles.listItem}>● To communicate information to you</Text>
          <Text style={styles.listItem}>● For internal training and quality assurance purposes</Text>

          <Text style={styles.sectionTitle}>Who do we share your data with:</Text>
          <Text style={styles.sectionText}>
            We may share your information or data with:
          </Text>
          <Text style={styles.listItem}>(a) Third parties including our service providers in order to facilitate the provisions of services to you, carry out your requests, respond to your queries, fulfill your orders or for other operational and business reasons.</Text>
          <Text style={styles.listItem}>(b) With our group companies (to the extent relevant)</Text>
          <Text style={styles.listItem}>(c) Our auditors or advisors to the extent required by them for performing their services</Text>
          <Text style={styles.listItem}>(d) Governmental bodies, regulatory authorities, law enforcement authorities pursuant to our legal obligations or compliance requirements.</Text>

          <Text style={styles.sectionTitle}>How we use cookies</Text>
          <Text style={styles.sectionText}>
            We use "cookies" to collect information and to better understand customer behavior. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to avail our services to the full extent. We do not control the use of cookies by third parties. The third party service providers have their own privacy policies addressing how they use such information.
          </Text>

          <Text style={styles.sectionTitle}>Your rights relating to your data</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Right to Review</Text> - You can review the data provided by you and can request us to correct or amend such data (to the extent feasible, as determined by us). That said, we will not be responsible for the authenticity of the data or information provided by you.
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Withdrawal of your Consent</Text> - You can choose not to provide your data, at any time while availing our services or otherwise withdraw your consent provided to us earlier, in writing to our email ID: industrailcanteen@gmail.com. In the event you choose to not provide or later withdraw your consent, we may not be able to provide you, our services.
          </Text>
          <Text style={styles.sectionText}>
            Please note that these rights are subject to our compliance with applicable laws.
          </Text>

          <Text style={styles.sectionTitle}>How long will we retain your information or data for?</Text>
          <Text style={styles.sectionText}>
            We may retain your information or data (i) for as long as we are providing services to you; and (ii) as permitted under applicable law, we may also retain your data or information even after you terminate the business relationship with us. However, we will process such information or data in accordance with applicable laws and this Policy.
          </Text>

          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.sectionText}>
            We will use commercially reasonable and legally required precautions to preserve the integrity and security of your information and data.
          </Text>

          <Text style={styles.sectionTitle}>Shipping & Delivery Policy</Text>
          <Text style={styles.sectionText}>
            Not Applicable
          </Text>

          <Text style={styles.sectionTitle}>Cancellation & Refund Policy</Text>
          <Text style={styles.sectionText}>
            Not Applicable
          </Text>

          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.subSectionTitle}>1. Mode of Conducting the Chit and Ascertaining the Prized Subscriber</Text>
          <Text style={styles.listItem}>● The Proceedings will be regulated and conducted by the Foreman or his Authorized Officer and in all cases of dispute, the decision of the Foreman/Authorized officer will be final. The auction shall start from the Foreman’s Commission of 5% of the chit value and bidders may, in auction raise the bid amount up to 40%.</Text>
          <Text style={styles.listItem}>● A Non-prized subscriber, who cannot personally participate in the auction, may send his authorized agent, or forward to the Foreman a bid offer stating the maximum amount of bid he is willing to offer which must be received by the Foreman at least one day before the concerned auction date. Defaulted subscribers will not be allowed to participate in the auction. No outsider shall be permitted to participate in the auction. Chits which have been given as security for other prized chits will not be allowed to be auctioned without written consent from the Foreman.</Text>
          <Text style={styles.listItem}>● Bidder who bids the maximum amount and is awarded the prize must deliver the NACH and MINUTES forms to their nearest branch within 3 days of the auction, failing which their auction will be cancelled.</Text>
          <Text style={styles.listItem}>● If the prized subscriber wishes to cancel his bid due to bail or another reason, he must notify it within 4 days of the auction and the second highest bidder must undertake to take the money. The difference between the two will have to be paid first.</Text>
          <Text style={styles.listItem}>● If both the first and second bidders refuse to claim the prize money, the ticket will be re-auctioned, where both will have to pay the difference equally.</Text>
          <Text style={styles.listItem}>● In case the bid is cancelled after the specified date, the prized subscriber will have to pay the difference in re-auction or 1% of the voucher amount, whichever is higher.</Text>

          <Text style={styles.subSectionTitle}>2. Mode of Payment of Each Instalment and/or Penalty for Belated Payments</Text>
          <Text style={styles.sectionText}>
            Each and every subscriber shall pay to the Foreman the amount due to his ticket for each instalment on or before the due date of each such auction and shall get a receipt from the office. Where payments are made by cheque, cheques drawn on local banks should reach at least 7 days before the due date of payment and outstation cheques should reach at least 20 days before the due date of payment. Only after the realization of the cheques, the Subscriber shall get the eligibility to participate in the auction. Subscribers should include bank service charges to outstation cheques. All cheques & Drafts should be sent duly crossing them. If realization of the cheque is unduly delayed, the Subscriber should pay the cash against such cheque whenever Foreman insisted. If any cheque delivered by the Subscriber is returned unpaid, service charges and other bank charges shall be paid by the Subscriber and in future only D.D/Cash shall be accepted from such Subscribers. Subscribers are advised to collect valid receipt after depositing Cash/Delivering D.D./Cheque and thereafter get it entered in the respective pass book. They are advised not to write anything of their own in the Pass Book. Non receipt of the intimation by the subscriber should not be the valid reason for not paying the subscription; every subscriber must pay the instalment on or before the due date.
          </Text>

          <Text style={styles.subSectionTitle}>3. Non-Prized Subscriber</Text>
          <Text style={styles.sectionText}>
            If a non-prized subscriber fails to deposit his/her monthly subscription before the due date, a penalty will be charged at the rate of 3 paise per rupee or part thereof. If the default continues to the second month, the penalty will be charged at the rate of 6 paise per rupee or part thereof per month. If the default continues for more than two months, the subscriber will not be entitled to dividends in addition to the aforesaid penalty charges. A subscriber who has not made up-to-date payments of all the instalments due from him/her will not be permitted to bid in the auction. If a Non-Prized subscriber fails to pay subscriptions for three consecutive instalments, he shall be liable to be removed from the list of subscribers and the Foreman, at his option, shall be entitled to substitute a new subscriber in place of the defaulting subscriber or may himself subscribe for the ticket, and the defaulted ticket of the chit will be dealt with in accordance with the relevant provisions of the Chit Funds Act. The Foreman at his discretion can waive the penalties partly or fully and also postpone the removal of membership in suitable and deserving cases. An expelled subscriber, not substituted, may be readmitted on such terms as the Foreman deems proper. A cancelled subscriber is entitled to the amount actually subscribed by him, i.e., exclusive of dividends, less 5% of the chit amount towards damages for breach of contract. This amount is payable on application at the end of the chit period or earlier, if the vacancy is substituted.
          </Text>

          <Text style={styles.subSectionTitle}>4. Prized Subscriber</Text>
          <Text style={styles.sectionText}>
            When a prized Subscriber defaults in payment of the Subscription amount, a penalty of 6 paise per rupee or part thereof will be charged per month. If the defaults continue over a month, such a Subscriber will also not be entitled to dividends for the instalments after default in addition to the aforesaid penalty of 6 paise per rupee or part thereof per month. If the default continues consecutively for a period of 3 months, the Prized Subscriber loses the future dividends and the benefit of paying the future subscriptions in instalments. The Prized Subscribers and their sureties shall become liable to make a consolidated payment of all the future Subscriptions inclusive of the defaulted instalments with interest at the rate of 24% per annum from the date of default, apart from the legal expenses involved. The Foreman, at his discretion, can condone such defaults and receive any amount from the chit holder and allow him to continue as a subscriber. Such condonation will not in any way discharge the liability of the executants of security documents or of nominees or legal heirs. The death of a Subscriber will also not discharge the liability of the nominee or the legal heirs of the Subscriber.
          </Text>

          <Text style={styles.subSectionTitle}>5. Procedure for Receiving the Prize Amount by a Prized Subscriber</Text>
          <Text style={styles.listItem}>● The Prize amount will be paid to the Prized Subscriber at the Foreman’s office during hours on working days through RTGS/NEFT. This will be done within one month of his/her furnishing sufficient security for the due payment of future instalments and the security on inspection, scrutiny, etc., found to the satisfaction of the Foreman. Prized Subscribers, before drawing the chit amount, must furnish necessary security or sureties to the satisfaction of the Foreman for due payment of the future instalments. The security may be any of the following where the future liability is Rs. 3,00,000/- or less.</Text>
          <Text style={styles.listItem}>● In cases where the future liability exceeds Rs.3,00,000/-, no personal security will normally be accepted. Security should be in the form of a mortgage of immovable urban property, the value of which should exceed by one and a half times the amount due from the Prized Subscriber, and such property should be situated within a radius of ten miles of the Foreman’s Office, where the liability rests. In exceptional cases, and entirely at the discretion of the Company, personal sureties may also be accepted.</Text>
          <Text style={styles.listItem}>● The Foreman reserves his right to accept or reject any or all of the sureties. In case the Prized Subscriber or his nominee fails to furnish security and/or surety before the next succeeding auction date, the Foreman shall deposit the amount in the Approved Bank and inform the fact to the Prized Subscriber and the Registrar.</Text>
          <Text style={styles.listItem}>● In case the amount so deposited is not sufficient for the payment of future Subscriptions, the Foreman shall realize the balance amount from the Prized Subscriber with interest at 12% per annum and incidental charges.</Text>
          <Text style={styles.listItem}>● In case there remains a portion of the amount deposited after adjustment of all future subscriptions and incidental charges, the Foreman shall pay such amount to the Prized Subscriber after the termination of the Chit. In case the Foreman fails to do so, the Prized Subscriber or his nominee shall realize the same from the Foreman together with interest thereon at 12% per annum from the date of termination.</Text>
          <Text style={styles.listItem}>● If at any time after the prize amount is deposited with an Approved Bank, the Prized Subscriber or his nominee furnishes sufficient security to the satisfaction of the Foreman, the amount so deposited shall be withdrawn and paid to the Prized Subscriber after deducting any unpaid subscription till that date.</Text>
          <Text style={styles.listItem}>● Where any Prized Subscriber does not collect the prize amount in respect of any instalment of a chit within a period of two months from the date of the draw, it shall be open to the Foreman to hold another draw in respect of such instalment. Where the Prized Subscriber informs the Foreman in writing about his inability to draw the prize amount, it shall be open to the Foreman to hold another draw in respect of such instalment without waiting for two months.</Text>
          <Text style={styles.listItem}>● When the Prized Subscriber either does not furnish sufficient security and the prize money available is not sufficient to meet future subscriptions or the bid falls in the re-auction held in respect of such instalment, the Foreman has the right to recover such losses and incidental charges from the amounts showing to the credit of such unpaid Prized Subscriber.</Text>
          <Text style={styles.listItem}>● If the Foreman fails to pay the prize amount to the Prized Subscriber or his nominee after furnishing sufficient security, they shall be eligible to realize the prize money from the Foreman with interest at 12% per annum from the date of furnishing security.</Text>
          <Text style={styles.listItem}>● If the winning bidder fails to furnish the surety and does not pay the subscription three months after the auction, the auction and the voucher will be cancelled. Bid loss will be recovered from re-auction.</Text>
          <Text style={styles.listItem}>● Surety, once offered and accepted, will not be entertained again as surety for another chit holder until the liability of the previous chit holder is cleared. This may be waived at the discretion of the management. Any subscriber who has no monthly or regular income or whose monthly income does not exceed the amount specified for sureties or who has already stood as a surety to another subscriber may be called upon to furnish additional sureties. The sureties must furnish proof that their terms of service in Government, Public Sector Undertakings, Banks, and other institutions will be at least double that of the period remaining for the prizing.</Text>
          <Text style={styles.sectionText}>
            Note: The Prized Subscriber has to bear the charges for inspection of the property offered as security, legal fees, document writing charges, etc.
          </Text>

          <Text style={styles.subSectionTitle}>6. Disbursement of Discount</Text>
          <Text style={styles.sectionText}>
            The discount for every ticket auctioned shall be disbursed as a dividend equally between the prized and non-Prized subscribers after deducting therefrom the Foreman’s commission. Such dividend shall be adjusted towards the subscription payable for the next instalment.
          </Text>

          <Text style={styles.subSectionTitle}>7. Foreman’s Commission and the Installment at Which the Foreman is to Get the Prize Amount</Text>
          <Text style={styles.listItem}>● All the Subscribers should pay the amount of the 1st Instalment in full. The Foreman shall subscribe to a ticket in the chit and he shall obtain the chit amount in the first instalment without any deduction of discount.</Text>
          <Text style={styles.listItem}>● The Foreman’s commission shall be at five percent of the chit amount.</Text>

          <Text style={styles.subSectionTitle}>8. Transfer How to be Effected</Text>
          <Text style={styles.listItem}>● If a non-prized subscriber wishes to transfer his right in the chit, he shall file an application to that effect with the Foreman, specifying the name and address of the person in whose favour he wishes to transfer his rights. The Foreman has the right to approve or not to approve such transfer. If he does not approve a transfer, the decision therefore shall be communicated to the said Non-Prized Subscriber. If the transfer is approved, the Transferee shall be entitled to no more rights than the Transferor had in respect of the said ticket transferred.</Text>
          <Text style={styles.listItem}>● Without the previous sanction in writing from the Registrar of Chits, the Foreman shall not transfer his right to receive the subscriptions from the Prized Subscribers. Any such transfer shall, if it defeats or delays a non-Prized subscriber, be avoidable at the instance of the Subscriber.</Text>

          <Text style={styles.subSectionTitle}>9. Procedure to be Adopted on the Death of a Subscriber Before the Termination of the Chit</Text>
          <Text style={styles.sectionText}>
            Every subscriber is required to nominate at the time of enrolment his successor with full description of his/her name, age, profession, and address. In case of death and non-eligibility of a non-prized subscriber, the nominee so mentioned shall be entitled to continue the chit on the same terms and conditions. The said nominee shall be liable to execute a fresh chit agreement and, in case the nominee does not wish to continue the chit, he/she will be entitled to the amount which the deceased Subscriber has actually subscribed, i.e., exclusive of dividends, less 5% of the chit amount, damages for breach of contract. The amount due after the aforesaid deduction will be paid at the termination of the chit. But if the subscriber is substituted, the nominee shall execute an acknowledgement and an indemnity bond against possible claims from third persons or other legal heirs of the deceased subscriber.
          </Text>
          <Text style={styles.sectionText}>
            In the event a prized subscriber, who has been declared for the prize amount, expires before receiving the prize amount, the Foreman shall call upon the nominee mentioned in the agreement either to take the place of the deceased subscriber or to take the prize amount subject to deduction of all future subscriptions and the recovery of any or all losses caused by the deceased Subscriber as per the terms of the chit agreement.
          </Text>
          <Text style={styles.sectionText}>
            When a prized subscriber expires after receiving the prize money and thereby becomes a defaulter, the Foreman will proceed against his legal heirs, representatives, sureties, securities, etc., for such relief as he is entitled to.
          </Text>

          <Text style={styles.subSectionTitle}>10. Banks Where Chit Money May Be Deposited</Text>
          <Text style={styles.sectionText}>
            The chit money shall be deposited in any of the banks approved under the provisions of the Chit Funds Act, 1982.
          </Text>

          <Text style={styles.subSectionTitle}>11. Miscellaneous</Text>
          <Text style={styles.listItem}>● Any amount due to the Foreman from any Subscriber on account of his/her chits or chits guaranteed by him/her shall be appropriated from the subscriptions paid by such Subscriber in any of his/her other chits with the Foreman. Similarly, the security and other deposits of money made by the Foreman in respect of the chit shall be liable for discharging the liability of the Foreman to the Subscribers.</Text>
          <Text style={styles.listItem}>● Incidental charges pertaining to intimations sent to the defaulted Subscribers and to their guarantors and also enrolment fees fixed by the Foreman should be borne by the concerned subscribers only.</Text>
          <Text style={styles.listItem}>● Receipts shall be issued by the Foreman for all payments received by him. The Subscribers shall pass on proper acknowledgements for other documents and vouchers for all money received by them from the Foreman.</Text>
          <Text style={styles.listItem}>● The chit amount shall in no case be enhanced; if necessary, it may be reduced.</Text>
          <Text style={styles.listItem}>● If the Foreman fails to conduct and continue the chit, he shall pay the Non-Prized Subscribers their contributions including dividend within one month, failing which the said Subscribers shall be entitled to realize the same with permissible interest from the Foreman or from all or any of the following assets: the Security Deposit given by the Foreman, other properties belonging to the Foreman, other properties belonging to the Foreman from the Prized Subscribers.</Text>
          <Text style={styles.listItem}>● Other than the one chit amount which the Foreman is entitled to take in the first instalment without any discount, if the subscriber holds any other tickets and becomes prized, he shall give sufficient security for payment of future subscriptions in respect of these additional tickets, to the satisfaction of the Registrar. The Foreman shall not have any more rights than the other subscribers have in respect of such additional tickets.</Text>
          <Text style={styles.listItem}>● As the Foreman is an incorporated co-operative chit fund, the question of the Foreman dying or becoming unable to conduct the chit does not arise, unless it goes into liquidation. If it goes into liquidation, the official liquidator under the provisions of the Chit Funds Act will act as Foreman.</Text>
          <Text style={styles.listItem}>● Even if the dates fixed for auctions fall on holidays, the auction will be conducted on the next working day only. If the auction could not be conducted on the appointed day owing to causes beyond the control of the Foreman, such as freak of nature, bandhs, riots, etc., the auction will be adjourned to some other convenient date on intimation to the Subscribers.</Text>
          <Text style={styles.listItem}>● If any dispute arises between the Foreman and the Subscribers and in the absence of any provisions in this Chit Agreement, the provisions of the Chit Funds Act 40 of 1982 and the Rules framed thereunder shall apply and be binding on both the Foreman and the Subscribers.</Text>
          <Text style={styles.listItem}>● The Foreman, on receipt of a fee of Rs.5/-, will allow examination of pertinent chit records by non-Prized and unpaid Prized Subscribers under Section 44 of the Chit Funds Act 1982 at the Foreman’s office during office hours on all working days. One-week prior notice should be given to the Foreman. The inspection fee shall be leviable separately for each chit for which inspection is desired.</Text>
          <Text style={styles.listItem}>● If the Subscriber or the Guarantor dies or becomes of unsound mind or is otherwise incapacitated, the amount due to the Foreman will be recovered from the legal heirs of the deceased Subscriber or guarantor as the case may be.</Text>
          <Text style={styles.listItem}>● In case of a requirement for a Duplicate Pass Book, such Subscribers should pay Rs. 150/- towards charges.</Text>
          <Text style={styles.listItem}>● In case of Transfer of Chit, the Foreman shall charge a 1% Transfer Fee of the sala amount for customers.</Text>
          <Text style={styles.listItem}>● In respect of other points that have not been covered in this agreement, they should be dealt with in accordance with the provisions of the Chit Funds Act, 1982.</Text>
          <Text style={styles.listItem}>● General Laws shall have application on points found to have not been covered either by this Chit Agreement or the Chit Funds Act, 1982.</Text>
          <Text style={styles.listItem}>● The Subscribers shall declare that they have received the copy of the Chit Agreement, they have gone through it/heard it and abide by it.</Text>
          <Text style={styles.listItem}>● If the company finds any lack of trustworthiness (providing fake documents, threatening, cheating, rude/unbecoming behaviour) in the Subscriber at any time, the membership of such Subscriber will be cancelled. And the loss incurred by them, including the subscriber who did not receive the prize or was assigned to receive the prize, will have to be borne by that subscriber.</Text>

          <Text style={styles.sectionTitle}>Queries/ Grievance Officer</Text>
          <Text style={styles.sectionText}>
            For any queries, questions, or grievances around this Policy, please contact us using the contact information provided on this website.
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered By</Text>
          <Text style={styles.footerLogo}>WorldTek.in</Text>
        </View>
      </ScrollView>
      <DownNavbar style={styles.stckyNavbar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    padding: wp('4%'),
    paddingBottom: hp('15%'), // Space for footer and navbar
  },
  sectionContainer: {
    backgroundColor: COLORS.MENU_BG,
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('3%'),
    borderWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: hp('1%'),
  },
  subSectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  lastUpdated: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: hp('2%'),
  },
  sectionText: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_DARK,
    lineHeight: hp('3%'),
    marginBottom: hp('1.5%'),
  },
  listItem: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_DARK,
    lineHeight: hp('3%'),
    marginLeft: wp('4%'),
    marginBottom: hp('1%'),
  },
  boldText: {
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
  },
  footerLogo: {
    fontSize: wp('3.5%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: wp('1%'),
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default PrivacyPolicyScreen;

// import React from 'react';
// import {View, Text, ScrollView, StyleSheet} from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import Header from './header'; // Adjust path to your Header component
// import DownNavbar from './downNavbar'; // Adjust path to your DownNavbar component

// // Define interface for component props (if any are added later)
// interface PrivacyPolicyProps {}

// // Constants (aligned with ViewOrders.js)
// const COLORS = {
//   PRIMARY: '#0014A8',
//   TEXT_DARK: '#333',
//   TEXT_SECONDARY: '#888',
//   BACKGROUND: '#F3F6FB',
//   BORDER: '#e0e0e0',
// };

// // Define styles with StyleSheet.create for TypeScript
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.BACKGROUND,
//   },
//   scrollContainer: {
//     padding: wp('4%'),
//     paddingBottom: hp('12%'),
//   },
//   policyCard: {
//     backgroundColor: '#fff',
//     borderRadius: wp('4%'),
//     padding: wp('4.5%'),
//     shadowColor: '#000',
//     shadowOpacity: 0.07,
//     shadowRadius: wp('2%'),
//     shadowOffset: {width: 0, height: hp('0.2%')},
//     elevation: 3,
//   },
//   title: {
//     fontSize: wp('6%'),
//     fontWeight: 'bold',
//     color: COLORS.PRIMARY,
//     marginBottom: hp('1%'),
//   },
//   subtitle: {
//     fontSize: wp('4.5%'),
//     fontWeight: '600',
//     color: COLORS.TEXT_DARK,
//     marginBottom: hp('2%'),
//   },
//   description: {
//     fontSize: wp('3.8%'),
//     color: COLORS.TEXT_DARK,
//     marginBottom: hp('2%'),
//     lineHeight: hp('2.5%'),
//   },
//   sectionTitle: {
//     fontSize: wp('4.5%'),
//     fontWeight: 'bold',
//     color: COLORS.PRIMARY,
//     marginTop: hp('2%'),
//     marginBottom: hp('1%'),
//   },
//   sectionText: {
//     fontSize: wp('3.8%'),
//     color: COLORS.TEXT_DARK,
//     marginBottom: hp('1%'),
//     lineHeight: hp('2.5%'),
//   },
//   bulletPoint: {
//     fontSize: wp('3.8%'),
//     color: COLORS.TEXT_DARK,
//     marginLeft: wp('4%'),
//     marginBottom: hp('0.5%'),
//     lineHeight: hp('2.5%'),
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   stickyNavbar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     paddingVertical: hp('1.2%'),
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderTopWidth: wp('0.2%'),
//     borderTopColor: COLORS.BORDER,
//   },
// });

// const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
//   return (
//     <View style={styles.container}>
//       <Header text="Privacy Policy" />
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.policyCard}>
//           <Text style={styles.title}>Privacy Policy</Text>
//           <Text style={styles.subtitle}>
//             Industrial Wet Canteen - Welfare Canteen Program
//           </Text>
//           <Text style={styles.description}>
//             The Industrial Wet Canteen under the Welfare Canteen Program is
//             committed to protecting the privacy of users of our mobile
//             application. This Privacy Policy explains how we collect, use,
//             protect, and handle your personal information, as well as your
//             rights regarding your data. This policy applies to our app, which
//             uses mobile number login and allows saving QR codes to your device’s
//             gallery.
//           </Text>

//           <Text style={styles.sectionTitle}>1. Data We Collect</Text>
//           <Text style={styles.sectionText}>
//             We collect the following information:
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • <Text style={styles.bold}>Mobile Number</Text>: Used for login
//             authentication.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • <Text style={styles.bold}>Employee/Service ID</Text>: Used for
//             user verification during booking or food collection.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • <Text style={styles.bold}>Order History</Text>: Details of your
//             food orders, including items, quantities, and timestamps.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • <Text style={styles.bold}>QR Code Images</Text>: Generated for
//             order verification and optionally saved to your device’s gallery.
//           </Text>

//           <Text style={styles.sectionTitle}>2. Purpose of Data Collection</Text>
//           <Text style={styles.sectionText}>
//             We collect and use your data to:
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Authenticate users via mobile number for secure login.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Process, confirm, and manage food orders.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Maintain order history and enforce booking limits.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Generate QR codes for order verification and allow saving them to
//             your device’s gallery.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Ensure compliance with canteen policies and prevent misuse.
//           </Text>

//           <Text style={styles.sectionTitle}>3. Data Sharing</Text>
//           <Text style={styles.sectionText}>
//             We do not share your personal data with anyone, including third
//             parties, government entities, or internal teams, under any
//             circumstances.
//           </Text>

//           <Text style={styles.sectionTitle}>4. Data Security</Text>
//           <Text style={styles.sectionText}>
//             We use robust technical and administrative measures to protect your
//             data, including:
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Encryption of data in transit (e.g., during API calls for order
//             management).
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Secure storage of mobile numbers, order history, and QR code data
//             on servers in India.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Handling of QR code images saved to your device only with your
//             explicit permission.
//           </Text>

//           <Text style={styles.sectionTitle}>5. User Rights</Text>
//           <Text style={styles.sectionText}>You have the right to:</Text>
//           <Text style={styles.bulletPoint}>
//             • Request access to your personal information stored by the app.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Correct inaccurate or outdated information.
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • Request deletion of your data, subject to service limitations
//             (e.g., inability to use the app without a mobile number).
//           </Text>

//           <Text style={styles.sectionTitle}>6. Android Permissions</Text>
//           <Text style={styles.sectionText}>
//             Our app requires the following permissions to function:
//           </Text>
//           <Text style={styles.bulletPoint}>
//             • <Text style={styles.bold}>Internet</Text>: Required to connect to
//             our booking platform, fetch order details, and generate QR codes.
//           </Text>

//           <Text style={styles.sectionText}>
//             This permission is used solely for the purposes described above and
//             is not used to collect any unnecessary data. Disabling Internet
//             access may prevent the app from functioning properly.
//           </Text>
//         </View>
//       </ScrollView>
//       <DownNavbar style={styles.stickyNavbar} />
//     </View>
//   );
// };

// export default PrivacyPolicy;
