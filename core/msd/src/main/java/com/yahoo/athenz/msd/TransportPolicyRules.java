//
// This file generated by rdl 1.5.2. Do not modify!
//

package com.yahoo.athenz.msd;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import com.yahoo.rdl.*;

//
// TransportPolicyRules - Transport policy containing ingress and egress rules
//
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransportPolicyRules {
    public List<TransportPolicyIngressRule> ingress;
    public List<TransportPolicyEgressRule> egress;

    public TransportPolicyRules setIngress(List<TransportPolicyIngressRule> ingress) {
        this.ingress = ingress;
        return this;
    }
    public List<TransportPolicyIngressRule> getIngress() {
        return ingress;
    }
    public TransportPolicyRules setEgress(List<TransportPolicyEgressRule> egress) {
        this.egress = egress;
        return this;
    }
    public List<TransportPolicyEgressRule> getEgress() {
        return egress;
    }

    @Override
    public boolean equals(Object another) {
        if (this != another) {
            if (another == null || another.getClass() != TransportPolicyRules.class) {
                return false;
            }
            TransportPolicyRules a = (TransportPolicyRules) another;
            if (ingress == null ? a.ingress != null : !ingress.equals(a.ingress)) {
                return false;
            }
            if (egress == null ? a.egress != null : !egress.equals(a.egress)) {
                return false;
            }
        }
        return true;
    }
}