import { FC, useState, useEffect } from "react";
import { ModalGeneric } from "../../pages/UiElements/ModalGeneric";
import Loader from "../../common/Loader";
import {
  Page,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { IDonePayment } from "../../interfaces/transactions.interface";
import { FieldPDF } from "./FieldPDF";
import Logo from "../../images/logo/logo-m-duran.jpg";

interface Props {
  title: string;
  src: IDonePayment;
  errorMsg?: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  container: {
    flexDirection: "column",
  },
});
export const UrlIframe: FC<Props> = ({
  title,
  src,
  errorMsg = "Este producto no tiene ficha técnica",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, [src, isVisible, errorMsg]);

  return (
    <>
      <button
        className="mx-auto flex rounded px-4 py-2 font-bold text-rose-800 hover:bg-rose-700/15"
        onClick={() => setIsVisible(true)}
      >
        Ver PDF
      </button>
      <ModalGeneric
        title={title}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        children={
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <PDFViewer width={600} height={500}>
                <Document>
                  <Page size={"A4"}>
                    <View style={styles.container}>
                      <Image src={Logo}  />
                      <FieldPDF
                        fieldName={"Nro de Transaccion"}
                        value={`${src.id}`}
                      />
                       <FieldPDF
                        fieldName={"Detalle"}
                        value={`${src.debt.titleName}`}
                      />
                      <FieldPDF
                        fieldName={"Propietario"}
                        value={`${src.cardHolderName}`}
                      />
                      <FieldPDF
                        fieldName={"Año Predio"}
                        value={`${src.debt.year}`}
                      />
                      <FieldPDF
                        fieldName={"Total Pagado"}
                        value={`${src.amount}`}
                      />
                    </View>
                  </Page>
                </Document>
              </PDFViewer>
            )}
          </>
        }
      />
    </>
  );
};
